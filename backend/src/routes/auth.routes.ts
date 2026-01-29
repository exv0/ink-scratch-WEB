import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

let authController = new AuthController();
const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

// New profile update route
router.put("/update-profile", authController.updateProfile); // This will handle profile update

export default router;
