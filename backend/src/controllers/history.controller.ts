// backend/src/controllers/history.controller.ts

import { Request, Response } from "express";
import { UserModel } from "../models/user.model";

const MAX_HISTORY = 20; // keep only the 20 most recent entries

export class HistoryController {

  // GET /api/history
  async getHistory(req: Request, res: Response) {
    try {
      const user = await UserModel.findById(req.user!.id).select("readingHistory");
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      return res.json({ success: true, data: user.readingHistory });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // POST /api/history/update
  // Body: { mangaId, title, coverImage, chapterId, chapterNumber, chapterTitle, progress }
  async updateHistory(req: Request, res: Response) {
    try {
      const { mangaId, title, coverImage, chapterId, chapterNumber, chapterTitle, progress } = req.body;

      if (!mangaId || !title || !chapterId || chapterNumber === undefined) {
        return res.status(400).json({ success: false, message: "mangaId, title, chapterId and chapterNumber are required" });
      }

      const user = await UserModel.findById(req.user!.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      // Remove existing entry for this manga (we always keep only one entry per manga)
      user.readingHistory = user.readingHistory.filter(e => e.mangaId !== mangaId) as typeof user.readingHistory;

      // Prepend the new/updated entry
      user.readingHistory.unshift({
        mangaId,
        title,
        coverImage:    coverImage    ?? "",
        chapterId,
        chapterNumber,
        chapterTitle:  chapterTitle  ?? "",
        progress:      progress      ?? 0,
        updatedAt:     new Date(),
      });

      // Trim to max
      if (user.readingHistory.length > MAX_HISTORY) {
        user.readingHistory = user.readingHistory.slice(0, MAX_HISTORY) as typeof user.readingHistory;
      }

      await user.save();
      return res.json({ success: true, data: user.readingHistory });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // DELETE /api/history/:mangaId
  async removeFromHistory(req: Request, res: Response) {
    try {
      const { mangaId } = req.params;
      const user = await UserModel.findById(req.user!.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      user.readingHistory = user.readingHistory.filter(e => e.mangaId !== mangaId) as typeof user.readingHistory;
      await user.save();
      return res.json({ success: true, data: user.readingHistory });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // DELETE /api/history
  async clearHistory(req: Request, res: Response) {
    try {
      const user = await UserModel.findById(req.user!.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      user.readingHistory = [] as typeof user.readingHistory;
      await user.save();
      return res.json({ success: true, message: "History cleared" });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}