import mongoose from 'mongoose';
import User from '../models/User.js';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/web2_lab_db');
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    // Seed default admin account if not present
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        password: '1234',
        fullName: 'Administrator',
        email: 'admin@example.com',
        role: 'admin'
      });
      console.log('Default admin account seeded (username: admin, password: 1234)');
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
}
