import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { UserModel } from './models/user.model';
import { MONGODB_URI } from './config';

(async () => {
  console.log('Connecting to:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  const users = await UserModel.find({}, { email: 1, role: 1, _id: 0 });
  console.log('All users in DB:', JSON.stringify(users, null, 2));
  await mongoose.disconnect();
})();