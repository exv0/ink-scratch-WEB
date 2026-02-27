// backend/src/dtos/user.dto.ts

import z from "zod";
import { UserSchema } from "../types/user.type";

// Create User DTO
export const CreateUserDTO = UserSchema.pick({
  fullName: true,
  phoneNumber: true,
  gender: true,
  email: true,
  username: true,
  password: true,
})
  .extend({
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });
export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

// Login User DTO
export const LoginUserDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

// Update User DTO (for profile updates — includes theme)
export const UpdateUserDTO = z.object({
  profilePicture: z.string().optional(),
  bio: z.string().max(160).optional(),
  // ✅ Theme preference — user can update their own theme
  theme: z.enum(['light', 'dark', 'system']).optional(),
});
export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;

// Admin Create User DTO (with role)
export const AdminCreateUserDTO = UserSchema.pick({
  fullName: true,
  phoneNumber: true,
  gender: true,
  email: true,
  username: true,
  password: true,
  role: true,
})
  .extend({
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type AdminCreateUserDTO = z.infer<typeof AdminCreateUserDTO>;

// Admin Update User DTO (full user update including role)
export const AdminUpdateUserDTO = z.object({
  fullName: z.string().optional(),
  phoneNumber: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  email: z.string().email().optional(),
  username: z.string().min(3).max(30).optional(),
  profilePicture: z.string().optional(),
  bio: z.string().max(160).optional(),
  role: z.enum(['user', 'admin']).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
});
export type AdminUpdateUserDTO = z.infer<typeof AdminUpdateUserDTO>;