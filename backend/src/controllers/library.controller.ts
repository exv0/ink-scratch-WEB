// backend/src/controllers/library.controller.ts

import { Request, Response } from "express";
import { UserModel } from "../models/user.model";

export class LibraryController {

  // GET /api/library
  async getLibrary(req: Request, res: Response) {
    try {
      const user = await UserModel.findById(req.user!.id).select("library");
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      return res.json({ success: true, data: user.library });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // POST /api/library/add
  async addToLibrary(req: Request, res: Response) {
    try {
      const { mangaId, title, author, coverImage, status, genre, rating, year, description } = req.body;

      if (!mangaId || !title) {
        return res.status(400).json({ success: false, message: "mangaId and title are required" });
      }

      const user = await UserModel.findById(req.user!.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      // Check if already in library
      const exists = user.library.some((e) => e.mangaId === mangaId);
      if (exists) {
        return res.json({ success: true, message: "Already in library", data: user.library });
      }

      user.library.unshift({
        mangaId,
        title,
        author:      author      ?? "",
        coverImage:  coverImage  ?? "",
        status:      status      ?? "",
        genre:       genre       ?? [],
        rating:      rating      ?? 0,
        year:        year,
        description: description ?? "",
        addedAt:     new Date(),
      });

      await user.save();
      return res.json({ success: true, message: "Added to library", data: user.library });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // DELETE /api/library/:mangaId
  async removeFromLibrary(req: Request, res: Response) {
    try {
      const { mangaId } = req.params;

      const user = await UserModel.findById(req.user!.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      const before = user.library.length;
      user.library = user.library.filter((e) => e.mangaId !== mangaId) as typeof user.library;

      if (user.library.length === before) {
        return res.status(404).json({ success: false, message: "Manga not in library" });
      }

      await user.save();
      return res.json({ success: true, message: "Removed from library", data: user.library });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // GET /api/library/check/:mangaId
  async checkInLibrary(req: Request, res: Response) {
    try {
      const { mangaId } = req.params;
      const user = await UserModel.findById(req.user!.id).select("library");
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      const inLibrary = user.library.some((e) => e.mangaId === mangaId);
      return res.json({ success: true, data: { inLibrary } });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}