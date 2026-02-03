import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import upload from "../config/upload.config";

let userService = new UserService();

export class AuthController {
  async register(req: Request, res: Response) {
    upload.single("profileImage")(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Error uploading image",
        });
      }

      try {
        const { fullName, phoneNumber, gender, email, username, password, confirmPassword } = req.body;

        // Get file path if image was uploaded
        const filePath = req.file?.path
          ? req.file.path.replace(/\\/g, '/')
          : undefined;

        const userData = {
          fullName,
          phoneNumber,
          gender,
          email,
          username,
          password,
          confirmPassword,
          profilePicture: filePath,
        };

        const result = await userService.createUser(userData);

        return res.status(201).json({
          success: true,
          message: "User registered successfully",
          data: result.user,
          token: result.token,
        });
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message: error.message || "Registration failed",
        });
      }
    });
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await userService.loginUser({ email, password });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result.user,
        token: result.token,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Login failed",
      });
    }
  }

  // Update logged-in user's profile
  async updateProfile(req: Request, res: Response) {
    upload.single("profileImage")(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Error uploading image",
        });
      }

      try {
        const userId = req.user?.id;
        if (!userId) {
          return res.status(401).json({
            success: false,
            message: "Unauthorized",
          });
        }

        const { bio } = req.body;

        const filePath = req.file?.path
          ? req.file.path.replace(/\\/g, '/')
          : undefined;

        const updatedUser = await userService.updateProfile({
          userId,
          profilePicture: filePath,
          bio: bio,
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

  // ✅ Update user by ID (for admin or user updating their own profile)
  async updateUserById(req: Request, res: Response) {
    upload.single("profileImage")(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Error uploading image",
        });
      }

      try {
        const { id } = req.params;
        const { bio } = req.body;

        // Check authorization: user can only update their own profile unless they're admin
        if (req.user?.id !== id && req.user?.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: "Forbidden - You can only update your own profile",
          });
        }

        const filePath = req.file?.path
          ? req.file.path.replace(/\\/g, '/')
          : undefined;

        const updatedUser = await userService.updateProfile({
          userId: id,
          profilePicture: filePath,
          bio: bio,
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

  // ✅ New method to update user role (promote user to admin)
  async updateUserRole(req: Request, res: Response) {
    try {
      const { id } = req.params; // User ID from the URL params
      const { role } = req.body; // Role ('admin' or 'user') from the request body

      // Validate role
      if (!role || (role !== 'admin' && role !== 'user')) {
        return res.status(400).json({
          success: false,
          message: "Invalid role. Use 'admin' or 'user'.",
        });
      }

      // Fetch the user and update their role
      const updatedUser = await userService.updateUserById(id, { role });

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: `User role updated to ${role} successfully`,
        data: updatedUser,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update user role",
      });
    }
  }
}
