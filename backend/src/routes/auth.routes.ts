import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authorizeUser } from "../middlewares/authorized.middleware";

let authController = new AuthController();
const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected route - update logged-in user's profile
router.put("/update-profile", authorizeUser, authController.updateProfile);

// ✅ NEW: Update user by ID (for admin or user updating their own profile)
router.put("/:id", authorizeUser, authController.updateUserById.bind(authController));

export default router;