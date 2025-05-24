// pages/api/recipes.js
import { connectToDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { database } = await connectToDatabase();
  const recipes = database.collection('recipes');

  if (req.method === 'GET') {
    const list = await recipes
      .find({ userId: new ObjectId(decoded.userId) })
      .sort({ createdAt: -1 })
      .toArray();
    return res.status(200).json(list);
  }

  if (req.method === 'POST') {
    const { title, result, imageUrl } = req.body;
    const doc = await recipes.insertOne({
      userId: new ObjectId(decoded.userId),
      title,
      result,
      imageUrl,
      createdAt: new Date(),
    });
    return res.status(201).json(doc);
  }

  if (req.method === 'DELETE') {
    const id = req.query.id;
    if (!id) return res.status(400).json({ message: 'Missing ID' });

    await recipes.deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(decoded.userId),
    });
    return res.status(204).end();
  }

  return res.status(405).end();
}
