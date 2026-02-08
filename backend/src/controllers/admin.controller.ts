import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import upload from "../config/upload.config";
import { AdminCreateUserDTO, AdminUpdateUserDTO } from "../dtos/user.dto";
import bcryptjs from "bcryptjs";
import { PaginationHelper } from "../types/pagination.type";


let userService = new UserService();

export class AdminController {
  // POST /api/admin/users - Create new user (with image upload)
  async createUser(req: Request, res: Response) {
    upload.single("profileImage")(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Error uploading image",
        });
      }

      try {
        const { fullName, phoneNumber, gender, email, username, password, confirmPassword, role } = req.body;

        // Validate password match
        if (password !== confirmPassword) {
          return res.status(400).json({
            success: false,
            message: "Passwords do not match",
          });
        }

        // Get file path if image was uploaded
        const filePath = req.file?.path
          ? req.file.path.replace(/\\/g, '/')
          : undefined;

        // Create user with admin-defined role
        const userData = {
          fullName,
          phoneNumber,
          gender,
          email,
          username,
          password,
          role: role || 'user', // Default to 'user' if not specified
          profilePicture: filePath,
        };

        const result = await userService.createUser(userData);

        return res.status(201).json({
          success: true,
          message: "User created successfully",
          data: result.user,
        });
      } catch (error: any) {
        return res.status(400).json({
          success: false,
          message: error.message || "Failed to create user",
        });
      }
    });
  }

  // GET /api/admin/users - Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();

      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve users",
      });
    }
  }
  /**
 * ✅ NEW: GET /api/admin/users/paginated - Get users with pagination
 */
async getUsersPaginated(req: Request, res: Response) {
    try {
        const paginationParams = PaginationHelper.getPaginationParams(req.query);
        const result = await userService.getUsersWithPagination(paginationParams);

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            ...result, // Spreads 'data' and 'pagination'
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve users",
        });
    }
}

  // GET /api/admin/users/:id - Get user by ID
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to retrieve user",
      });
    }
  }

  // PUT /api/admin/users/:id - Update user (with image upload)
  async updateUser(req: Request, res: Response) {
    upload.single("profileImage")(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Error uploading image",
        });
      }

      try {
        const { id } = req.params;
        const { fullName, phoneNumber, gender, email, username, bio, role } = req.body;

        // Get file path if image was uploaded
        const filePath = req.file?.path
          ? req.file.path.replace(/\\/g, '/')
          : undefined;

        // Build update data object
        const updateData: any = {};
        if (fullName) updateData.fullName = fullName;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (gender) updateData.gender = gender;
        if (email) updateData.email = email;
        if (username) updateData.username = username;
        if (bio !== undefined) updateData.bio = bio;
        if (role) updateData.role = role; // Admin can change role
        if (filePath) updateData.profilePicture = filePath;

        const updatedUser = await userService.updateUserById(id, updateData);

        return res.status(200).json({
          success: true,
          message: "User updated successfully",
          data: updatedUser,
        });
      } catch (error: any) {
        return res.status(error.statusCode || 500).json({
          success: false,
          message: error.message || "Failed to update user",
        });
      }
    });
  }

  // DELETE /api/admin/users/:id - Delete user
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Prevent admin from deleting themselves
      if (req.user?.id === id) {
        return res.status(400).json({
          success: false,
          message: "You cannot delete your own account",
        });
      }

      await userService.deleteUser(id);

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to delete user",
      });
    }
  }
}