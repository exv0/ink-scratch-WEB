// backend/src/routes/admin.routes.ts - UPDATED VERSION

import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authorizeUser } from "../middlewares/authorized.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";

let adminController = new AdminController();
const router = Router();

// All admin routes require authentication and admin role
router.use(authorizeUser);
router.use(isAdmin);

// ✅ NEW: Pagination route must come BEFORE :id routes to avoid route collision
router.get("/users/paginated", adminController.getUsersPaginated.bind(adminController));

// User management routes
router.post("/users", adminController.createUser.bind(adminController));
router.get("/users", adminController.getAllUsers.bind(adminController)); // Legacy route
router.get("/users/:id", adminController.getUserById.bind(adminController));
router.put("/users/:id", adminController.updateUser.bind(adminController));
router.delete("/users/:id", adminController.deleteUser.bind(adminController));

export default router;