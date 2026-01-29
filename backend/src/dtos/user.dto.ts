import z, { email } from "zod";
import { UserSchema } from "../types/user.type";

// Create User DTO
export const CreateUserDTO = UserSchema.pick(
    {
        fullName: true,
        phoneNumber: true,
        gender: true,
        email: true,
        username: true,
        password: true 
    }
).extend({
    confirmPassword: z.string().min(6)
}).refine( // extra validation for confirmPassword
    (data) => data.password === data.confirmPassword,
    {
        message: "Password do not match",
        path: ["confirmPassword"]
    }
);
export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

// Login User DTO
export const LoginUserDTO = z.object({
    email: z.email(),
    password: z.string().min(6),
});
export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

// **Added UpdateUserDTO** to handle profile update
export const UpdateUserDTO = z.object({
    profilePicture: z.string().optional(), // Optional field for profile picture path
    bio: z.string().max(160).optional(),   // Optional field for bio, with max length of 160 characters
});

export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>; // Type for UpdateUserDTO
