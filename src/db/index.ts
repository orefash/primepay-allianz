import { MongoClient } from 'mongodb';


const isProduction = process.env.NODE_ENV === 'production';

const mongodbUri: string = (isProduction ? process.env.MONGO_URI_PROD_LOG : process.env.MONGO_URI_DEV_LOG) ?? "mongodb://localhost:27017";

async function checkMongoDBConnection(uri: string): Promise<boolean> {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(uri);

    // Connect to the MongoDB server
    await client.connect();

    // Check if the connection is successful by pinging the database
    const pingResult = await client.db().command({ ping: 1 });
    return pingResult.ok === 1;
  } catch (error) {
    console.error('Error checking MongoDB connection:', error);
    return false;
  } finally {
    // Close the connection, if it was established
    if (client) {
      await client.close();
    }
  }
}

// Example Usage:
const mongoURI = mongodbUri;

export async function runDBCheck() : Promise<string> {
  const isConnected = await checkMongoDBConnection(mongoURI);
  if (isConnected) {
    console.log('MongoDB is working and connected successfully!');
    return('MongoDB is working and connected successfully!');
  } else {
    console.error('MongoDB is not working or could not connect.');
    return('MongoDB is not working or could not connect.');
  }
}

// runCheck();