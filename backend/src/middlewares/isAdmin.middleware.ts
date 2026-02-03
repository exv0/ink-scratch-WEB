import { Request, Response, NextFunction } from "express";

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if user exists (set by authorizeUser middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user found",
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Admin access required",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking admin privileges",
    });
  }
};