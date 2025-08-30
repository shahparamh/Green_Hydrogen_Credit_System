import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Use MongoDB Atlas URI if available, otherwise fallback to local
    const mongoUri = process.env.MONGODB_URI_ATLAS || process.env.MONGODB_URI || 'mongodb://localhost:27017/greenh2_credits';
    
    const conn = await mongoose.connect(mongoUri, {
      // MongoDB Atlas connection options
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    
    // Don't exit process, let the application handle it gracefully
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log('⚠️  Continuing without database connection in development mode');
    }
  }
};
