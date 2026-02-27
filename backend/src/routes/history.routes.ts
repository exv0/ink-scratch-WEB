// backend/src/routes/history.routes.ts

import { Router } from "express";
import { HistoryController } from "../controllers/history.controller";
import { authorizeUser } from "../middlewares/authorized.middleware";

const router = Router();
const ctrl   = new HistoryController();

// All history routes require auth
router.use(authorizeUser);

router.get("/",                   ctrl.getHistory.bind(ctrl));
router.post("/update",            ctrl.updateHistory.bind(ctrl));
router.delete("/",                ctrl.clearHistory.bind(ctrl));
router.delete("/:mangaId",        ctrl.removeFromHistory.bind(ctrl));

export default router;