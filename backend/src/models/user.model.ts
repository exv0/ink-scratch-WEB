// backend/src/models/user.model.ts - FIXED VERSION

import mongoose, { Document, Schema } from "mongoose";
import { UserType } from '../types/user.type';

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        fullName: { type: String },
        phoneNumber: { type: String }, // ✅ FIXED: Changed from Number to String to match DTO
        gender: { type: String, enum: ['male', 'female', 'other'] },
        profilePicture: { type: String },
        bio: { type: String, maxLength: 160 },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        // ✅ Password reset fields
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
    },
    {
        timestamps: true, // auto createdAt and updatedAt
    }
);

// ✅ FIXED: Proper interface that extends both UserType and Document
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    username: string;
    fullName?: string;
    phoneNumber?: string; // ✅ String type to match DTO
    gender: 'male' | 'female' | 'other';
    profilePicture?: string;
    bio?: string;
    role: 'user' | 'admin';
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export const UserModel = mongoose.model<IUser>('User', UserSchema);