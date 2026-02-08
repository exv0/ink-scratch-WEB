// backend/src/routes/auth.routes.ts - UPDATED VERSION

import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authorizeUser } from "../middlewares/authorized.middleware";

let authController = new AuthController();
const router = Router();

// Public routes
router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));

// ✅ NEW: Password reset routes (public)
router.post("/forgot-password", authController.forgotPassword.bind(authController));
router.post("/reset-password", authController.resetPassword.bind(authController));
router.get("/verify-reset-token/:token", authController.verifyResetToken.bind(authController));

// Protected routes - update logged-in user's profile
router.put("/update-profile", authorizeUser, authController.updateProfile.bind(authController));

// Update user by ID (for admin or user updating their own profile)
router.put("/:id", authorizeUser, authController.updateUserById.bind(authController));

export default router;