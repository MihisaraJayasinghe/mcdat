import clientPromise from '../../../library/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('schoolStore');
  const collection = db.collection('students');

  switch (req.method) {
    case 'GET':
      try {
        const data = await collection.find({}).toArray();
        res.status(200).json(data);
      } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Failed to fetch data' });
      }
      break;
      
    case 'POST':
      try {
        const { name, studentId, studentClass } = req.body;
        if (!name || !studentId || !studentClass) {
          res.status(400).json({ error: 'All fields are required' });
          return;
        }
        const result = await collection.insertOne({ name, studentId, studentClass });
        res.status(201).json(result.ops[0]);
      } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Failed to insert data' });
      }
      break;
      
      case 'PATCH':
        // Handle PATCH request
        const updatedItem = req.body;
        await db.collection('students').updateOne(
          { _id: new ObjectId(updatedItem._id) },
          { $set: { name: updatedItem.name, studentId: updatedItem.studentId, studentClass: updatedItem.studentClass } }
        );
        res.status(200).json(updatedItem);
        break;
  

      case 'DELETE':
        try {
          const { id } = req.query;
          if (!id) {
            res.status(400).json({ error: 'ID is required' });
            return;
          }
          if (!ObjectId.isValid(id)) {
            res.status(400).json({ error: 'Invalid ID format' });
            return;
          }
          const result = await collection.deleteOne({ _id: new ObjectId(id) }); // Use new ObjectId
          if (result.deletedCount === 0) {
            res.status(404).json({ error: 'Document not found' });
          } else {
            res.status(200).json({ success: true });
          }
        } catch (err) {
          console.error('Error deleting data:', err.message); // Log detailed error message
          res.status(500).json({ error: 'Failed to delete data', details: err.message });
        }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
