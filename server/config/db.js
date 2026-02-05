const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/arcadia');
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.warn('⚠️  Server will continue without database. Some features may not work.');
    // Don't exit - allow server to run without DB for demo purposes
  }
};

module.exports = connectDB;
