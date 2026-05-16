import mongoose from 'mongoose';
import { config } from '../../config.js';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Error:', error.message);
    process.exit(1);
  }
};

export default connectDB;