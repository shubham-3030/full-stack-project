const mongoose = require('mongoose');

const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blogapp';

  try {
    // Attempt connecting to specified MongoDB server (Local or Atlas)
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error (${error.message}).`);

    // In production (e.g. Render), require valid MONGODB_URI connection
    if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
      console.error('Production Environment Detected: Ensure MONGODB_URI is valid and 0.0.0.0/0 IP Access is enabled on MongoDB Atlas.');
      process.exit(1);
    }

    // In local development/testing, try MongoMemoryServer fallback
    console.log('Initializing In-Memory MongoDB Server for local testing...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServerInstance = await MongoMemoryServer.create({
        binary: {
          version: '7.0.3',
        },
      });
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
