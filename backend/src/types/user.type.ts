// backend/src/types/user.type.ts - FIXED VERSION

import z from 'zod';

// Base user schema for creation/validation
export const UserSchema = z.object({
    email: z.string().email().min(5),
    password: z.string().min(5),
    username: z.string().min(3).max(30),
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(), 
    gender: z.enum(['male', 'female', 'other']),
    profilePicture: z.string().optional(),
    bio: z.string().max(160).optional(),
    role: z.enum(['user', 'admin']).default('user'),
});

export type UserType = z.infer<typeof UserSchema>;

// ✅ Extended user type that includes database fields (timestamps, reset tokens, etc.)
export interface UserWithDbFields extends UserType {
    _id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}