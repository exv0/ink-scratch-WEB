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

  /**
   * ✅ NEW: POST /api/auth/forgot-password - Request password reset
   */
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      await userService.requestPasswordReset(email);

      // Always return success (don't reveal if email exists)
      return res.status(200).json({
        success: true,
        message: "If that email exists, a password reset link has been sent",
      });
    } catch (error: any) {
      console.error('Error in forgotPassword:', error);
      return res.status(500).json({
        success: false,
        message: "Failed to process password reset request",
      });
    }
  }

  /**
   * ✅ NEW: POST /api/auth/reset-password - Reset password with token
   */
  async resetPassword(req: Request, res: Response) {
    try {
      const { token, password, confirmPassword } = req.body;

      // Validation
      if (!token || !password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Token, password, and confirm password are required",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: "Passwords do not match",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      await userService.resetPassword(token, password);

      return res.status(200).json({
        success: true,
        message: "Password has been reset successfully",
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to reset password",
      });
    }
  }

  /**
   * ✅ NEW: GET /api/auth/verify-reset-token/:token - Verify if reset token is valid
   */
  async verifyResetToken(req: Request, res: Response) {
    try {
      const { token } = req.params;

      const isValid = await userService.verifyResetToken(token);

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Token is valid",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Failed to verify token",
      });
    }
  }
}