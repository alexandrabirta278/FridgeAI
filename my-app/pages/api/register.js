import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  const { database } = await connectToDatabase();
  const users = database.collection('users');

  const existingUser = await users.findOne({ email });
  if (existingUser) return res.status(409).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  await users.insertOne({ email, password: hashedPassword });

  return res.status(201).json({ message: 'User registered successfully' });
}
