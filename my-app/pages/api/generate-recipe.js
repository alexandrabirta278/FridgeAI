// /pages/api/generate-recipe.js
import { IncomingForm } from 'formidable';
import fs from 'fs';
import OpenAI from 'openai';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  // 1. 🔐 Verifică JWT
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // 2. 📦 Parsare formular
  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: 'Form parsing error' });

    const ingredients = fields.ingredients || '';
    const imageFile = files.image;
    let imageUrl = '';

    // 3. ☁️ Upload imagine (dacă există)
    if (imageFile) {
      const upload = await cloudinary.uploader.upload(imageFile.filepath, {
        folder: 'fridge-ai',
      });
      imageUrl = upload.secure_url;
    }

    // 4. 🧠 Prompt GPT
    const messages = [
      {
        role: 'user',
        content: [
          { type: 'text', text: `Here are some ingredients: ${ingredients}. Can you suggest 2 recipes?` },
          ...(imageUrl
            ? [{ type: 'image_url', image_url: { url: imageUrl } }]
            : []),
        ],
      },
    ];

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
      });

      const result = completion.choices[0]?.message?.content;

      // 5. 💾 Salvare în MongoDB
      const { database } = await connectToDatabase();
      await database.collection('recipes').insertOne({
        userId: new ObjectId(decoded.userId),
        ingredients,
        imageUrl,
        result,
        createdAt: new Date(),
      });

      return res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({ message: 'OpenAI error', error });
    }
  });
}
