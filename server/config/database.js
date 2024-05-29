import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useUnifiedTopology: true
    });
    console.log('connected to mongoDB successfully');
  } catch (err) {
    console.log('server error:', err.message);
  }
};

export default connectDB;
