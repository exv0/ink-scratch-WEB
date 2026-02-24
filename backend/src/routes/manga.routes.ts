import { Router } from "express";
import { MangaController } from "../controllers/manga.controller";
import { authorizeUser } from "../middlewares/authorized.middleware";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const router = Router();
const ctrl   = new MangaController();

// ⚠️ Order matters — specific routes before param routes
router.get("/proxy",                ctrl.proxyImage.bind(ctrl));     // image proxy for MangaDex CDN
router.get("/search",               ctrl.search.bind(ctrl));
router.get("/chapters/:chapterId",  ctrl.getChapterPages.bind(ctrl));
router.get("/",                     ctrl.getAll.bind(ctrl));
router.get("/:id",                  ctrl.getById.bind(ctrl));
router.get("/:id/chapters",         ctrl.getChapters.bind(ctrl));

// Admin only
router.post("/import", authorizeUser, isAdmin, ctrl.triggerImport.bind(ctrl));

export default router;