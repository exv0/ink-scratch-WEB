import axios from "axios";
import { Request, Response } from "express";
import { MangaModel, ChapterModel } from "../models/manga.model";
import { searchManga, getFreshChapterPages } from "../services/mangadex.service";

export class MangaController {

  // GET /api/manga
  async getAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, genre, status, sort = "rating" } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const filter: any = {};
      if (genre)  filter.genre  = genre;
      if (status) filter.status = status;

      const sortMap: Record<string, any> = {
        rating:   { rating: -1 },
        latest:   { updatedAt: -1 },
        chapters: { totalChapters: -1 },
        title:    { title: 1 },
      };

      const [data, total] = await Promise.all([
        MangaModel
          .find(filter)
          .sort(sortMap[sort as string] ?? sortMap.rating)
          .skip(skip)
          .limit(Number(limit)),
        MangaModel.countDocuments(filter),
      ]);

      return res.json({
        success: true,
        data,
        pagination: {
          page:  Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // GET /api/manga/search?q=naruto
  async search(req: Request, res: Response) {
    try {
      const q = req.query.q as string;
      if (!q) return res.status(400).json({ success: false, message: "Query required" });

      const local = await MangaModel.find({
        $or: [
          { title:             { $regex: q, $options: "i" } },
          { alternativeTitles: { $regex: q, $options: "i" } },
          { author:            { $regex: q, $options: "i" } },
        ],
      }).limit(10);

      if (local.length > 0) {
        return res.json({ success: true, data: local, source: "local" });
      }

      const remote = await searchManga(q, 10);
      return res.json({ success: true, data: remote, source: "mangadex-live" });

    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // GET /api/manga/:id
  async getById(req: Request, res: Response) {
    try {
      const manga = await MangaModel.findById(req.params.id);
      if (!manga) return res.status(404).json({ success: false, message: "Manga not found" });
      return res.json({ success: true, data: manga });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // GET /api/manga/:id/chapters
  async getChapters(req: Request, res: Response) {
    try {
      const chapters = await ChapterModel
        .find({ mangaId: req.params.id })
        .sort({ chapterNumber: 1 })
        .select("-pages");

      return res.json({ success: true, data: chapters });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // GET /api/manga/chapters/:chapterId
  async getChapterPages(req: Request, res: Response) {
    try {
      const chapter = await ChapterModel.findById(req.params.chapterId);
      if (!chapter) return res.status(404).json({ success: false, message: "Chapter not found" });

      let pages: { index: number; imageUrl: string }[];
      try {
        pages = await getFreshChapterPages(chapter.sourceId);
      } catch (mdErr: any) {
        console.warn(`[MangaDex] Failed to get fresh pages for ${chapter.sourceId}: ${mdErr.message}`);
        pages = chapter.pages;
      }

      return res.json({
        success: true,
        data: {
          _id:           chapter._id,
          mangaId:       chapter.mangaId,
          chapterNumber: chapter.chapterNumber,
          title:         chapter.title,
          sourceId:      chapter.sourceId,
          publishedAt:   chapter.publishedAt,
          createdAt:     chapter.createdAt,
          pages,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // GET /api/manga/proxy?url=...
  async proxyImage(req: Request, res: Response) {
    try {
      const imageUrl = req.query.url as string;
      if (!imageUrl) {
        return res.status(400).json({ success: false, message: "url query param required" });
      }

      let urlObj: URL;
      try {
        urlObj = new URL(imageUrl);
      } catch {
        return res.status(400).json({ success: false, message: "Invalid URL" });
      }

      // MangaDex at-home servers run on arbitrary CDN hostnames (volunteer nodes),
      // so we can't allowlist by domain. Instead we validate by:
      // 1. Must be HTTPS (prevents SSRF to internal/local addresses)
      // 2. Either a known MangaDex-owned domain, OR a valid at-home node path
      //    structure: /data/<32-char-md5-hash>/<filename>
      const isHttps = urlObj.protocol === "https:";
      const isMangaDexOwned =
        urlObj.hostname === "mangadex.org" ||
        urlObj.hostname.endsWith(".mangadex.org") ||
        urlObj.hostname.endsWith(".mangadex.network");
      const isAtHomeNode = /^\/(data|data-saver)\/[a-f0-9]{32}\//.test(urlObj.pathname);

      if (!isHttps || (!isMangaDexOwned && !isAtHomeNode)) {
        console.warn(`[Proxy] Blocked: ${urlObj.hostname}${urlObj.pathname}`);
        return res.status(403).json({ success: false, message: "Domain not allowed" });
      }

      console.log(`[Proxy] Fetching: ${imageUrl}`);

      const response = await axios.get(imageUrl, {
        responseType: "stream",
        headers: {
          Referer:      "https://mangadex.org",
          "User-Agent": "Mozilla/5.0 (compatible; InkScratch/1.0)",
        },
        timeout: 20000,
      });

      console.log(`[Proxy] Success, content-type: ${response.headers["content-type"]}`);

      res.setHeader("Content-Type",                response.headers["content-type"] || "image/jpeg");
      res.setHeader("Cache-Control",               "public, max-age=86400");
      res.setHeader("Access-Control-Allow-Origin", "*");

      response.data.pipe(res);
    } catch (err: any) {
      // Log full error details to backend terminal
      console.error(`[Proxy] FAILED:`, {
        message:  err.message,
        code:     err.code,
        status:   err.response?.status,
        data:     err.response?.data,
      });
      return res.status(502).json({
        success: false,
        message: "Failed to proxy image",
        detail:  err.message,
        code:    err.code,
      });
    }
  }

  // POST /api/manga/import (admin only)
  async triggerImport(req: Request, res: Response) {
    try {
      import("../jobs/manga.importer").then(({ runMangaImportJob }) => {
        runMangaImportJob().catch(console.error);
      });
      return res.json({ success: true, message: "Import job started in background" });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}