import clientPromise from '../../../library/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('test'); // Use your database name
  const collection = db.collection('data'); // Use your collection name

  switch (req.method) {
    case 'GET':
      const data = await collection.find({}).toArray();
      res.status(200).json(data);
      break;
    case 'POST':
      const { name, value } = req.body;
      const result = await collection.insertOne({ name, value });
      res.status(201).json(result.ops[0]);
      break;
    case 'PUT':
      const { _id, updateName, updateValue } = req.body;
      const updatedItem = await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: { name: updateName, value: updateValue } }
      );
      res.status(200).json(updatedItem);
      break;
    case 'DELETE':
      const { id } = req.query;
      await collection.deleteOne({ _id: new ObjectId(id) });
      res.status(204).end();
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}