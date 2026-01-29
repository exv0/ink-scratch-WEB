import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { HttpError } from "../errors/http-error";
import { UserRepository } from "../repositories/user.repository";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

let userRepository = new UserRepository();

export class UserService {
    async createUser(data: CreateUserDTO) {
        // Business logic before creating User
        const emailCheck = await userRepository.getUserByEmail(data.email);
        if (emailCheck) {
            throw new Error("Email already in use");
        }
        const usernameCheck = await userRepository.getUserByUsername(data.username);
        if (usernameCheck) {
            throw new Error("Username already in use");
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(data.password, 10);
        data.password = hashedPassword;

        // Create user
        const newUser = await userRepository.createUser(data);

        // Generate JWT token for the new user
        const payload = {
            id: newUser._id,
            email: newUser.email,
            username: newUser.username,
            fullName: newUser.fullName,
            phoneNumber: newUser.phoneNumber,
            role: newUser.role
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });

        return { token, user: newUser };
    }

    async loginUser(data: LoginUserDTO) {
        const user = await userRepository.getUserByEmail(data.email);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        
        // Compare password
        const validPassword = await bcryptjs.compare(data.password, user.password);
        if (!validPassword) {
            throw new HttpError(401, "Invalid Credentials");
        }

        // Generate JWT
        const payload = {
            id: user._id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            role: user.role
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
        
        return { token, user };
    }

    // **New method to update user profile**
    async updateProfile(data: UpdateUserDTO & { userId: string }) {
        const { userId, profilePicture, bio } = data;

        // Find the user and update their profile
        const updatedUser = await userRepository.updateUser(userId, {
            profilePicture, // Update profile picture if present
            bio,            // Update bio if provided
        });

        return updatedUser;
    }
}
