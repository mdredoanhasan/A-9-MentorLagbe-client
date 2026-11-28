import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("MONGODB_URI is missing");

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

const client = global._mongoClient ?? new MongoClient(uri);
if (!global._mongoClient) global._mongoClient = client;

export const db = client.db("Mentor-lagbe"); // ba client.db("your_db_name")
export { client };