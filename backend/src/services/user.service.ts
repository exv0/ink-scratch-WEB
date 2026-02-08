// backend/src/services/user.service.ts - FIXED VERSION

import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { HttpError } from "../errors/http-error";
import { UserRepository } from "../repositories/user.repository";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { PaginationParams, PaginationResult } from "../types/pagination.type";
import crypto from "crypto";
import { EmailService } from "./email.service";
import { IUser } from "../models/user.model";

let userRepository = new UserRepository();

// ✅ User response type (what we send to frontend - no sensitive data)
interface UserResponse {
    _id: string;
    email: string;
    username: string;
    fullName?: string;
    phoneNumber?: string;
    gender: 'male' | 'female' | 'other';
    role: 'user' | 'admin';
    profilePicture: string | null;
    bio?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class UserService {
    // Initialize email service at class level
    private emailService = new EmailService();

    // ✅ Helper function to get base URL for images
    private getImageBaseUrl(): string {
        const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
        console.log('🌐 Image Base URL:', baseUrl);
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
        console.log(`🔗 Converting image URL: ${relativePath} → ${fullUrl}`);
        return fullUrl;
    }

    // ✅ Helper function to format user response with full image URLs
    private formatUserResponse(user: IUser): UserResponse {
        const formattedUser: UserResponse = {
            _id: user._id.toString(),
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            gender: user.gender,
            role: user.role,
            profilePicture: this.getFullImageUrl(user.profilePicture),
            bio: user.bio,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        console.log('👤 Formatted user response:', {
            email: formattedUser.email,
            profilePicture: formattedUser.profilePicture
        });
        return formattedUser;
    }

    async createUser(data: CreateUserDTO | any) {
        // Business logic before creating User
        const emailCheck = await userRepository.getUserByEmail(data.email);
        if (emailCheck) {
            throw new HttpError(400, "Email already in use");
        }
        const usernameCheck = await userRepository.getUserByUsername(data.username);
        if (usernameCheck) {
            throw new HttpError(400, "Username already in use");
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(data.password, 10);
        data.password = hashedPassword;

        // Remove confirmPassword before saving (if it exists)
        const { confirmPassword, ...userDataToSave } = data;

        // Create user
        const newUser = await userRepository.createUser(userDataToSave);

        // Generate JWT token for the new user
        const payload = {
            id: newUser._id.toString(),
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
            id: user._id.toString(),
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

    // **Update user profile**
    async updateProfile(data: UpdateUserDTO & { userId: string }) {
        const { userId, profilePicture, bio } = data;

        console.log('📝 Updating profile:', { userId, profilePicture, bio });

        // Find the user and update their profile
        const updatedUser = await userRepository.updateUser(userId, {
            profilePicture,
            bio,
        });

        if (!updatedUser) {
            throw new HttpError(404, "User not found");
        }

        // ✅ Return formatted user with full image URLs
        return this.formatUserResponse(updatedUser);
    }

    // ✅ Get all users (for admin) - LEGACY METHOD for backward compatibility
    async getAllUsers(): Promise<UserResponse[]> {
        const users = await userRepository.getAllUsers();
        return users.map(user => this.formatUserResponse(user));
    }

    // ✅ NEW: Get users with pagination, search, and sorting
    async getUsersWithPagination(params: PaginationParams): Promise<PaginationResult<UserResponse>> {
        const result = await userRepository.getUsersWithPagination(params);
        
        // Format each user in the paginated result
        const formattedData = result.data.map(user => this.formatUserResponse(user));
        
        return {
            data: formattedData,
            pagination: result.pagination,
        };
    }

    // ✅ Get user by ID (for admin)
    async getUserById(userId: string): Promise<UserResponse> {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        return this.formatUserResponse(user);
    }

    // ✅ Update user by ID (for admin - can update any field)
    async updateUserById(userId: string, updateData: any): Promise<UserResponse> {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new HttpError(404, "User not found");
        }

        // If password is being updated, hash it
        if (updateData.password) {
            updateData.password = await bcryptjs.hash(updateData.password, 10);
        }

        const updatedUser = await userRepository.updateUser(userId, updateData);
        
        if (!updatedUser) {
            throw new HttpError(500, "Failed to update user");
        }
        
        return this.formatUserResponse(updatedUser);
    }

    // ✅ Delete user (for admin)
    async deleteUser(userId: string): Promise<boolean> {
        const user = await userRepository.getUserById(userId);
        if (!user) {
            throw new HttpError(404, "User not found");
        }

        const result = await userRepository.deleteUser(userId);
        if (!result) {
            throw new HttpError(500, "Failed to delete user");
        }
        return true;
    }

    // ========================================
    // PASSWORD RESET METHODS
    // ========================================

    /**
     * ✅ Request password reset
     */
    async requestPasswordReset(email: string): Promise<void> {
        // Find user by email
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            // Don't reveal if email exists for security
            console.log('⚠️ Password reset requested for non-existent email:', email);
            return; // Silently succeed
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        
        // Token expires in 1 hour
        const expires = new Date(Date.now() + 60 * 60 * 1000);

        // Save token to user
        await userRepository.saveResetToken(user._id.toString(), hashedToken, expires);

        // Send email with reset token
        await this.emailService.sendPasswordResetEmail(user.email, resetToken);

        console.log('✅ Password reset email sent to:', user.email);
    }

    /**
     * ✅ Reset password with token
     */
    async resetPassword(token: string, newPassword: string): Promise<void> {
        // Hash the token to compare with stored hash
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token
        const user = await userRepository.getUserByResetToken(hashedToken);
        if (!user) {
            throw new HttpError(400, 'Invalid or expired reset token');
        }

        // Hash new password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        // Update password
        await userRepository.updateUser(user._id.toString(), {
            password: hashedPassword,
        });

        // Clear reset token
        await userRepository.clearResetToken(user._id.toString());

        // Send confirmation email
        await this.emailService.sendPasswordResetConfirmation(user.email);

        console.log('✅ Password reset successful for user:', user.email);
    }

    /**
     * ✅ Verify reset token validity
     */
    async verifyResetToken(token: string): Promise<boolean> {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await userRepository.getUserByResetToken(hashedToken);
        return !!user;
    }
}