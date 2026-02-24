import { MangaModel, ChapterModel } from "../models/manga.model";
import {
  fetchPopularManga,
  fetchChapters,
  fetchChapterPages,
} from "../services/mangadex.service";

const IMPORT_LIMIT       = 100;
const CHAPTERS_PER_MANGA = 50;
const DELAY_MS           = 1000;  
const MAX_RETRIES        = 3;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ── Retry wrapper with exponential backoff ────────────────────────────────────
async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const is429 = err?.response?.status === 429;
      const isLast = attempt === MAX_RETRIES;

      if (isLast) throw err;

      if (is429) {
        // MangaDex rate limit — back off hard
        const wait = 60000 * attempt; // 1min, 2min, 3min
        console.warn(`[Importer] Rate limited on "${label}", waiting ${wait / 1000}s before retry ${attempt}/${MAX_RETRIES}...`);
        await sleep(wait);
      } else {
        // Other error — short backoff
        const wait = 2000 * attempt;
        console.warn(`[Importer] Error on "${label}", retrying in ${wait / 1000}s (attempt ${attempt}/${MAX_RETRIES})...`);
        await sleep(wait);
      }
    }
  }
  throw new Error(`All retries exhausted for "${label}"`);
}

// ── Main job ──────────────────────────────────────────────────────────────────
export async function runMangaImportJob() {
  console.log(`[Importer] Starting manga import job at ${new Date().toISOString()}`);

  try {
    const mangaList = await withRetry(() => fetchPopularManga(IMPORT_LIMIT), "fetchPopularManga");
    console.log(`[Importer] Fetched ${mangaList.length} manga from MangaDex`);

    for (const mangaData of mangaList) {
      try {
        // Upsert manga
        const manga = await MangaModel.findOneAndUpdate(
          { sourceId: mangaData.sourceId },
          { ...mangaData, lastImportedAt: new Date() },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        await sleep(DELAY_MS);

        // Fetch chapters with retry
        const chapters = await withRetry(
          () => fetchChapters(manga.sourceId, CHAPTERS_PER_MANGA),
          manga.title
        );
        console.log(`[Importer]   "${manga.title}" — ${chapters.length} chapters`);

        for (const chapterData of chapters) {
          const exists = await ChapterModel.exists({ sourceId: chapterData.sourceId });
          if (exists) continue;

          await sleep(DELAY_MS);

          // Fetch pages with retry
          const pages = await withRetry(
            () => fetchChapterPages(chapterData.sourceId),
            `${manga.title} ch.${chapterData.chapterNumber}`
          );

          await ChapterModel.create({
            mangaId: manga._id,
            ...chapterData,
            pages,
            source: "mangadex",
          });

          console.log(`[Importer]     Chapter ${chapterData.chapterNumber} imported (${pages.length} pages)`);
        }

        // Update chapter count
        const count = await ChapterModel.countDocuments({ mangaId: manga._id });
        await MangaModel.findByIdAndUpdate(manga._id, { totalChapters: count });

      } catch (err: any) {
        console.error(`[Importer] Skipping "${mangaData.title}" after all retries: ${err.message}`);
      }
    }

    console.log(`[Importer] Job complete at ${new Date().toISOString()}`);
  } catch (err: any) {
    console.error(`[Importer] Job failed: ${err.message}`);
    throw err;
  }
}