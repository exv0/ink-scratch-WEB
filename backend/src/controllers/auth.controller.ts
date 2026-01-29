import { UserService } from "../services/user.service";
import { Request, Response } from "express";
import z from "zod";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import upload from "../config/upload.config"; // Multer configuration for file uploads

let userService = new UserService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const parsedData = CreateUserDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: z.prettifyError(parsedData.error)
                });
            }

            const userData: CreateUserDTO = parsedData.data;

            const { token, user } = await userService.createUser(userData);

            return res.status(201).json({
                success: true,
                message: "User Created",
                data: user,
                token
            });
        } catch (error: Error | any) {
            return res.status(500).json({
                success: false,
                message: error.message || "Internal Service Error"
            });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const parsedData = LoginUserDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json({
                    success: false,
                    message: z.prettifyError(parsedData.error)
                });
            }

            const loginData: LoginUserDTO = parsedData.data;
            const { token, user } = await userService.loginUser(loginData);

            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: user,
                token
            });
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    // Updated profile update method
    async updateProfile(req: Request, res: Response) {
        upload.single("profileImage")(req, res, async (err: any) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message || "Error uploading image"
                });
            }

            try {
                const { bio } = req.body;
                const filePath = req.file?.path; // Get the uploaded file path

                if (!req.user || !req.user.id) {
                    return res.status(400).json({
                        success: false,
                        message: "User not authenticated"
                    });
                }

                const updatedUser = await userService.updateProfile({
                    userId: req.user.id, // Assuming user ID is in req.user (after authentication)
                    profilePicture: filePath, // Store the file path in the profilePicture field
                    bio: bio, // Update the bio if provided
                });

                return res.status(200).json({
                    success: true,
                    message: "Profile updated successfully",
                    data: updatedUser,
                });
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to update profile",
                });
            }
        });
    }
}
