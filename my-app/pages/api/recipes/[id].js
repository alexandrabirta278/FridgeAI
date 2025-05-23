import { connectToDatabase } from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { database } = await connectToDatabase();
  const recipes = database.collection('recipes');

  if (req.method === 'DELETE') {
    await recipes.deleteOne({ _id: new ObjectId(req.query.id), userId: new ObjectId(decoded.userId) });
    return res.status(204).end();
  }

  return res.status(405).end();
}
