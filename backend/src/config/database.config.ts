import mongoose from 'mongoose';

const connectDB = async (): Promise<typeof mongoose | undefined> => {
  try {
    // Connect to MongoDB - both User and AuthUser will use the same database
    const mainConn = await mongoose.connect(process.env.MONGODB_URI as string, {
      serverSelectionTimeoutMS: 30000, // Increased to 30 seconds
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📦 Database: ${mainConn.connection.name}`);
    console.log(`🌐 Host: ${mainConn.connection.host}`);
    console.log(`🔐 Collection: Users (unified model with auth + profile)`);

    return mainConn;
  } catch (error) {
    const err = error as Error;
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('Full error:', err);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    return undefined;
  }
};

export default connectDB;
