import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { HttpError } from "../errors/http-error";
import { UserRepository } from "../repositories/user.repository";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

let userRepository = new UserRepository();

export class UserService {
    // ✅ Helper function to get base URL for images
    private getImageBaseUrl(): string {
        const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
        console.log('🌐 Image Base URL:', baseUrl); // ✅ Debug log
        return baseUrl;
    }

    // ✅ Helper function to convert relative path to full URL
    private getFullImageUrl(relativePath: string | null | undefined): string | null {
        if (!relativePath) return null;
        
        // If it's already a full URL, return as is
        if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
            console.log('✅ Image URL already full:', relativePath);
            return relativePath;
        }
        
        // Convert relative path to full URL
        const baseUrl = this.getImageBaseUrl();
        const fullUrl = `${baseUrl}/${relativePath}`;
        console.log(`🔗 Converting image URL: ${relativePath} → ${fullUrl}`); // ✅ Debug log
        return fullUrl;
    }

    // ✅ Helper function to format user response with full image URLs
    private formatUserResponse(user: any) {
        const formattedUser = {
            _id: user._id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            role: user.role,
            profilePicture: this.getFullImageUrl(user.profilePicture), // ✅ Full URL
            bio: user.bio,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        console.log('👤 Formatted user response:', {
            email: formattedUser.email,
            profilePicture: formattedUser.profilePicture
        }); // ✅ Debug log
        return formattedUser;
    }

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

        // ✅ Return formatted user with full image URLs
        return { token, user: this.formatUserResponse(newUser) };
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
        
        // ✅ Return formatted user with full image URLs
        return { token, user: this.formatUserResponse(user) };
    }

    // **New method to update user profile**
    async updateProfile(data: UpdateUserDTO & { userId: string }) {
        const { userId, profilePicture, bio } = data;

        console.log('📝 Updating profile:', { userId, profilePicture, bio }); // ✅ Debug log

        // Find the user and update their profile
        const updatedUser = await userRepository.updateUser(userId, {
            profilePicture, // Update profile picture if present
            bio,            // Update bio if provided
        });

        // ✅ Return formatted user with full image URLs
        return this.formatUserResponse(updatedUser);
    }
}