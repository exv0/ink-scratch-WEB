// backend/src/repositories/user.repository.ts - FIXED VERSION

import { UserModel, IUser } from "../models/user.model";
import { PaginationParams, PaginationResult, PaginationHelper } from "../types/pagination.type";

export class UserRepository {
  // Create a new user
  async createUser(data: any): Promise<IUser> {
    const newUser = new UserModel(data);
    return await newUser.save();
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  // Get user by username
  async getUserByUsername(username: string): Promise<IUser | null> {
    return await UserModel.findOne({ username });
  }

  // Get user by ID
  async getUserById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }

  // ✅ Get all users (LEGACY - for backward compatibility)
  async getAllUsers(): Promise<IUser[]> {
    return await UserModel.find().sort({ createdAt: -1 });
  }

  // ✅ Get users with pagination
  async getUsersWithPagination(params: PaginationParams): Promise<PaginationResult<IUser>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search = '' } = params;

    // Build search query
    const searchQuery: any = {};
    if (search) {
      searchQuery.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Build sort object
    const sortObject: any = {};
    sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries in parallel
    const [users, total] = await Promise.all([
      UserModel.find(searchQuery)
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .lean(),
      UserModel.countDocuments(searchQuery),
    ]);

    return PaginationHelper.createPaginationResult(users as IUser[], total, page, limit);
  }

  // ✅ Update user - with better null handling
  async updateUser(id: string, data: any): Promise<IUser | null> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    return updatedUser;
  }

  // Delete user
  async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }

  /**
   * ✅ Find user by reset token
   */
  async getUserByResetToken(token: string): Promise<IUser | null> {
    return await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    });
  }

  /**
   * ✅ Save reset token to user
   */
  async saveResetToken(userId: string, token: string, expires: Date): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(
      userId,
      {
        resetPasswordToken: token,
        resetPasswordExpires: expires,
      },
      { new: true }
    );
  }

  /**
   * ✅ Clear reset token after use
   */
  async clearResetToken(userId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $unset: {
        resetPasswordToken: 1,
        resetPasswordExpires: 1,
      },
    });
  }
}