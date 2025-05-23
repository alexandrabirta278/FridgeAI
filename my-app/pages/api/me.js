import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { database } = await connectToDatabase();
    const users = database.collection('users');
    const user = await users.findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ email: user.email });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
