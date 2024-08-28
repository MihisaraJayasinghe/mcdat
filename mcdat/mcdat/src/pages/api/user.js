import clientPromise from '../../../library/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Ensure this is set in your environment variables

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('schoolStore');
  const collection = db.collection('users');

  switch (req.method) {
    case 'POST': // Register
      try {
        const { username, password } = req.body;
        if (!username || !password) {
          res.status(400).json({ error: 'Username and password are required' });
          return;
        }

        // Check if username already exists
        const existingUser = await collection.findOne({ username });
        if (existingUser) {
          res.status(400).json({ error: 'Username already exists' });
          return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the new user
        const result = await collection.insertOne({ username, password: hashedPassword });
        const newUser = { id: result.insertedId, username }; // Create user object for response
        res.status(201).json({ message: 'User registered successfully', user: newUser });
      } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Failed to register user' });
      }
      break;

    case 'PATCH': // Login
      try {
        const { username, password } = req.body;
        if (!username || !password) {
          res.status(400).json({ error: 'Username and password are required' });
          return;
        }

        // Find the user
        const user = await collection.findOne({ username });
        if (!user) {
          res.status(401).json({ error: 'Invalid username or password' });
          return;
        }

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          res.status(401).json({ error: 'Invalid username or password' });
          return;
        }

        // Create a JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
      } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ error: 'Failed to log in' });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'PATCH']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
