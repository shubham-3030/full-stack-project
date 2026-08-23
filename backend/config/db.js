const mongoose = require('mongoose');

let mongoServerInstance = null;

const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blogapp';

  try {
    // Try connecting to local MongoDB with 1.5s timeout
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 1500,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`Local MongoDB server not detected on port 27017 (${error.message}).`);
    console.log('Initializing In-Memory MongoDB Server for instant seamless execution...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServerInstance = await MongoMemoryServer.create();
      const mongoUri = mongoServerInstance.getUri();

      const conn = await mongoose.connect(mongoUri);
      console.log(`In-Memory MongoDB Connected successfully: ${conn.connection.host}`);
      return conn;
    } catch (memError) {
      console.error(`Failed to connect to In-Memory MongoDB: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
