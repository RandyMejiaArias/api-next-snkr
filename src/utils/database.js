import mongoose from 'mongoose';
import config from '../config.js';

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);

    console.log('DB is connected');
  } catch (err) {
    console.log('Failed to connect to MongoDB. ', err);
  }
};

connectDB();
