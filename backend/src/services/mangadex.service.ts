import axios from "axios";

const BASE       = "https://api.mangadex.org";
const COVER_BASE = "https://uploads.mangadex.org/covers";

// ── MangaDex API types ────────────────────────────────────────────────────────
interface MDRelationship {
  id: string;
  type: string;
  attributes?: any;
}

interface MDManga {
  id: string;
  attributes: {
    title: Record<string, string>;
    altTitles: Record<string, string>[];
    description: Record<string, string>;
    status: string;
    year: number | null;
    tags: { attributes: { name: Record<string, string>; group: string } }[];
    lastChapter: string | null;
  };
  relationships: MDRelationship[];
}

interface MDChapter {
  id: string;
  attributes: {
    chapter: string | null;
    title: string | null;
    translatedLanguage: string;
    publishAt: string;
    pages: number;
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function pickTitle(titles: Record<string, string>): string {
  return titles["en"] || titles["ja-ro"] || Object.values(titles)[0] || "Unknown";
}

function mapStatus(s: string): "Ongoing" | "Completed" | "Hiatus" | "Cancelled" {
  const map: Record<string, any> = {
    ongoing:   "Ongoing",
    completed: "Completed",
    hiatus:    "Hiatus",
    cancelled: "Cancelled",
  };
  return map[s] ?? "Ongoing";
}

function normalizeManga(m: MDManga) {
  const coverRel  = m.relationships.find(r => r.type === "cover_art");
  const authorRel = m.relationships.find(r => r.type === "author");
  const artistRel = m.relationships.find(r => r.type === "artist");

  const coverFilename = coverRel?.attributes?.fileName;
  const coverImage    = coverFilename ? `${COVER_BASE}/${m.id}/${coverFilename}.256.jpg` : "";

  const genres = m.attributes.tags
    .filter(t => t.attributes.group === "genre")
    .map(t => pickTitle(t.attributes.name));

  const altTitles = m.attributes.altTitles
    .map(a => Object.values(a)[0])
    .filter(Boolean) as string[];

  return {
    sourceId:          m.id,
    source:            "mangadex",
    title:             pickTitle(m.attributes.title),
    alternativeTitles: altTitles,
    author:            authorRel?.attributes?.name ?? "Unknown",
    artist:            artistRel?.attributes?.name ?? "Unknown",
    description:       m.attributes.description?.en ?? "",
    status:            mapStatus(m.attributes.status),
    year:              m.attributes.year ?? undefined,
    genre:             genres,
    coverImage,
    totalChapters:     parseInt(m.attributes.lastChapter ?? "0") || 0,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────
export async function fetchPopularManga(limit = 100, offset = 0) {
  const { data } = await axios.get(`${BASE}/manga`, {
    params: {
      limit,
      offset,
      contentRating:                ["safe", "suggestive"],
      includes:                     ["cover_art", "author", "artist"],
      order:                        { followedCount: "desc" },
      availableTranslatedLanguage:  ["en"],
    },
  });
  return data.data.map((m: MDManga) => normalizeManga(m));
}

export async function searchManga(query: string, limit = 20, offset = 0) {
  const { data } = await axios.get(`${BASE}/manga`, {
    params: {
      title:                        query,
      limit,
      offset,
      contentRating:                ["safe", "suggestive"],
      includes:                     ["cover_art", "author", "artist"],
      order:                        { followedCount: "desc" },
      availableTranslatedLanguage:  ["en"],
    },
  });
  return data.data.map((m: MDManga) => normalizeManga(m));
}

export async function fetchChapters(mangadexId: string, limit = 100, offset = 0) {
  const { data } = await axios.get(`${BASE}/manga/${mangadexId}/feed`, {
    params: {
      limit,
      offset,
      translatedLanguage: ["en"],
      order:              { chapter: "asc" },
      contentRating:      ["safe", "suggestive"],
    },
  });

  return data.data
    .filter((ch: MDChapter) => ch.attributes.pages > 0)
    .map((ch: MDChapter) => ({
      sourceId:      ch.id,
      chapterNumber: parseFloat(ch.attributes.chapter ?? "0"),
      title:         ch.attributes.title ?? undefined,
      publishedAt:   new Date(ch.attributes.publishAt),
    }));
}

/**
 * Fetches fresh page URLs from MangaDex at-home server on demand.
 * Do NOT store the baseUrl — it is session-scoped and expires.
 * Instead store hash + filename so we can reconstruct URLs fresh each time.
 */
export async function fetchChapterPages(
  chapterId: string
): Promise<{ index: number; imageUrl: string; hash: string; filename: string }[]> {
  const { data } = await axios.get(`${BASE}/at-home/server/${chapterId}`);
  const baseUrl = data.baseUrl;
  const { hash, data: files } = data.chapter;

  return files.map((filename: string, i: number) => ({
    index:    i,
    // Store a permanent proxy-friendly URL format
    imageUrl: `${baseUrl}/data-saver/${hash}/${filename}`,
    hash,
    filename,
  }));
}

/**
 * Get fresh image URLs for a chapter by calling at-home server live.
 * Use this in the controller instead of returning stored imageUrls.
 */
export async function getFreshChapterPages(
  chapterSourceId: string
): Promise<{ index: number; imageUrl: string }[]> {
  const { data } = await axios.get(`${BASE}/at-home/server/${chapterSourceId}`);
  const baseUrl = data.baseUrl;
  const { hash, data: files } = data.chapter;

  return files.map((filename: string, i: number) => ({
    index:    i,
    imageUrl: `${baseUrl}/data-saver/${hash}/${filename}`,
  }));
}