import OpenAI from 'openai';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

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

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = new IncomingForm({ keepExtensions: true, multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ message: 'Form parsing error' });

    const ingredients = fields.ingredients || '';
    const imageFile = files.image?.[0] || files.image;

    let imageUrl = '';
    if (imageFile && imageFile.filepath) {
      try {
        const upload = await cloudinary.uploader.upload(imageFile.filepath, {
          folder: 'fridge-ai',
        });
        imageUrl = upload.secure_url;
      } catch (uploadErr) {
        return res.status(500).json({ message: 'Cloudinary upload failed', error: uploadErr });
      }
    }

    const messages = [
      {
        role: 'user',
        content: [
          { type: 'text', text: `Here are some ingredients: ${ingredients}. Can you suggest 2 recipes?` },
          ...(imageUrl ? [{ type: 'image_url', image_url: { url: imageUrl } }] : []),
        ],
      },
    ];

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
      });

      const result = completion.choices[0]?.message?.content || 'No recipe found.';
      return res.status(200).json({ result });
    } catch (error) {
      return res.status(500).json({ message: 'OpenAI error', error });
    }
  });
}
