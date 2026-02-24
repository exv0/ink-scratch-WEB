import { API_ENDPOINTS } from '../config';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface Manga {
  _id: string;
  title: string;
  alternativeTitles: string[];
  author: string;
  artist: string;
  description: string;
  genre: string[];
  status: 'Ongoing' | 'Completed' | 'Hiatus' | 'Cancelled';
  coverImage: string;
  rating: number;
  year?: number;
  totalChapters: number;
  source: string;
  sourceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  _id: string;
  mangaId: string;
  chapterNumber: number;
  title?: string;
  sourceId: string;
  publishedAt: string;
  createdAt: string;
}

export interface ChapterPage {
  index: number;
  imageUrl: string;
}

export interface ChapterWithPages extends Chapter {
  pages: ChapterPage[];
}

export interface MangaListResponse {
  success: boolean;
  data: Manga[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ── Service ───────────────────────────────────────────────────────────────────
export const mangaService = {

  // GET /api/manga
  getAll: async (params?: {
    page?: number;
    limit?: number;
    genre?: string;
    status?: string;
    sort?: string;
  }): Promise<MangaListResponse> => {
    const query = new URLSearchParams();
    if (params?.page)   query.set('page',   String(params.page));
    if (params?.limit)  query.set('limit',  String(params.limit));
    if (params?.genre && params.genre !== 'All')   query.set('genre',  params.genre);
    if (params?.status && params.status !== 'All') query.set('status', params.status);
    if (params?.sort)   query.set('sort',   params.sort);

    const res = await fetch(`${API_ENDPOINTS.MANGA.BASE}?${query}`);
    if (!res.ok) throw new Error('Failed to fetch manga list');
    return res.json();
  },

  // GET /api/manga/search?q=
  search: async (q: string): Promise<{ success: boolean; data: Manga[]; source: string }> => {
    const res = await fetch(`${API_ENDPOINTS.MANGA.SEARCH}?q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  // GET /api/manga/:id
  getById: async (id: string): Promise<{ success: boolean; data: Manga }> => {
    const res = await fetch(API_ENDPOINTS.MANGA.BY_ID(id));
    if (!res.ok) throw new Error('Manga not found');
    return res.json();
  },

  // GET /api/manga/:id/chapters
  getChapters: async (mangaId: string): Promise<{ success: boolean; data: Chapter[] }> => {
    const res = await fetch(API_ENDPOINTS.MANGA.CHAPTERS(mangaId));
    if (!res.ok) throw new Error('Failed to fetch chapters');
    return res.json();
  },

  // GET /api/manga/chapters/:chapterId — fetches metadata only
  getChapterPages: async (chapterId: string): Promise<{ success: boolean; data: ChapterWithPages }> => {
    const res = await fetch(API_ENDPOINTS.MANGA.CHAPTER_PAGES(chapterId));
    if (!res.ok) throw new Error('Chapter not found');
    return res.json();
  },

  // Fetch fresh image URLs directly from MangaDex at-home API.
  // Uses the dataSaver filenames with the /data-saver/ path (they must match).
  getFreshPages: async (chapterSourceId: string): Promise<ChapterPage[]> => {
    const res = await fetch(
      `https://api.mangadex.org/at-home/server/${chapterSourceId}`
    );
    if (!res.ok) throw new Error('Failed to fetch image URLs from MangaDex');
    const data = await res.json();

    const baseUrl: string = data.baseUrl;
    const hash: string = data.chapter.hash;

    // dataSaver filenames must be used with /data-saver/ path
    // data filenames must be used with /data/ path
    // Mixing them causes 404s
    const files: string[] = data.chapter.dataSaver;

    return files.map((filename: string, i: number) => ({
      index:    i,
      imageUrl: `${baseUrl}/data-saver/${hash}/${filename}`,
    }));
  },
};