import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri);

async function connectDatabase() {
  await client.connect();
  return client.db('vibe');
}

export default connectDatabase