import mongoose from 'mongoose';

const connectDB = async () => {
  try {
     const mongoUri=process.env.MONGO_URI as string
     console.log(mongoUri)
    await mongoose.connect(mongoUri)
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export default connectDB;
