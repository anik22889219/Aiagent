require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('ERROR: MONGO_URI is not set. Add it to .env or export it before running.');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. Successfully connected to MongoDB!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

run().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
