import OpenAI from 'openai';
import { IncomingForm } from 'formidable';
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

function cleanMarkdown(text) {
  return text
    .replace(/^#+\s*/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/```[a-z]*\n?|```/g, '')
    .trim();
}

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
    if (imageFile?.filepath) {
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
          {
            type: 'text',
            text: `Here are some ingredients: ${ingredients}. Return a short recipe title on the first line, then a Markdown-formatted recipe below.`,
          },
          ...(imageUrl ? [{ type: 'image_url', image_url: { url: imageUrl } }] : []),
        ],
      },
    ];

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
      });

      const full = completion.choices[0]?.message?.content || '';
      const [titleLine, ...rest] = full.split('\n');
      const title = titleLine.replace(/^[^a-zA-Z0-9]*/, '').trim();
      const rawResult = rest.join('\n').trim();
      const result = cleanMarkdown(rawResult); // ← curățăm aici


      return res.status(200).json({ title, result });
    } catch (error) {
      return res.status(500).json({ message: 'OpenAI error', error });
    }
  });
}