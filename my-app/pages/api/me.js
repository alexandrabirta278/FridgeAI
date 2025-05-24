import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const token = req.cookies.token;
  if (!token) return res.status(200).json({ user: null });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { database } = await connectToDatabase();
    const users = database.collection('users');
    const user = await users.findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) return res.status(200).json({ user: null });

    return res.status(200).json({ user: { email: user.email } });
  } catch (err) {
    return res.status(200).json({ user: null });
  }
}
