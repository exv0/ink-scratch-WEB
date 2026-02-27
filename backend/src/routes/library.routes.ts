// backend/src/routes/library.routes.ts

import { Router } from "express";
import { LibraryController } from "../controllers/library.controller";
import { authorizeUser } from "../middlewares/authorized.middleware";

const router = Router();
const ctrl   = new LibraryController();

// All library routes require auth
router.use(authorizeUser);

router.get("/",                     ctrl.getLibrary.bind(ctrl));
router.post("/add",                 ctrl.addToLibrary.bind(ctrl));
router.delete("/:mangaId",          ctrl.removeFromLibrary.bind(ctrl));
router.get("/check/:mangaId",       ctrl.checkInLibrary.bind(ctrl));

export default router;