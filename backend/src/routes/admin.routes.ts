import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authorizeUser } from "../middlewares/authorized.middleware";
import { authorizeAdmin } from "../middlewares/admin.middleware";

let adminController = new AdminController();
const router = Router();

// All admin routes require authentication AND admin role
router.use(authorizeUser); // First check if user is logged in
router.use(authorizeAdmin); // Then check if user is admin

// POST /api/admin/users - Create new user (with Multer for image upload)
router.post("/users", adminController.createUser.bind(adminController));

// GET /api/admin/users - Get all users
router.get("/users", adminController.getAllUsers.bind(adminController));

// GET /api/admin/users/:id - Get user by ID
router.get("/users/:id", adminController.getUserById.bind(adminController));

// PUT /api/admin/users/:id - Update user (with Multer for image upload)
router.put("/users/:id", adminController.updateUser.bind(adminController));

// DELETE /api/admin/users/:id - Delete user
router.delete("/users/:id", adminController.deleteUser.bind(adminController));

export default router;