// lib/services/library.service.ts
// Now persists to the backend (user.library in MongoDB) instead of localStorage.
// Falls back gracefully if the user is not authenticated.

import { API_BASE_URL } from "../config";

const BASE = `${API_BASE_URL}/api/library`;

export interface LibraryManga {
  mangaId:     string;
  /** Keep _id as alias so existing UI code using manga._id still works */
  _id:         string;
  title:       string;
  author:      string;
  coverImage?: string;
  status:      string;
  genre:       string[];
  rating:      number;
  year?:       number;
  description?: string;
  addedAt:     string; // ISO date string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function authHeaders(): HeadersInit {
  // Token is stored in a cookie by the auth service; for Bearer-based setups
  // grab it from the cookie or localStorage depending on your AuthContext impl.
  if (typeof document === "undefined") return { "Content-Type": "application/json" };
  const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/); // fixed: was "token", key is "auth_token"
  const token = match ? match[1] : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Normalise a raw library entry from the backend so _id === mangaId */
function normalise(entry: any): LibraryManga {
  return {
    ...entry,
    _id:     entry.mangaId ?? entry._id,
    addedAt: entry.addedAt ?? new Date().toISOString(),
  };
}

// ── Service ───────────────────────────────────────────────────────────────────

export const libraryService = {

  async getAll(): Promise<LibraryManga[]> {
    try {
      const res = await fetch(BASE, { headers: authHeaders() });
      if (!res.ok) return [];
      const json = await res.json();
      return (json.data ?? []).map(normalise);
    } catch {
      return [];
    }
  },

  async isInLibrary(mangaId: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE}/check/${mangaId}`, { headers: authHeaders() });
      if (!res.ok) return false;
      const json = await res.json();
      return json.data?.inLibrary ?? false;
    } catch {
      return false;
    }
  },

  async add(manga: Omit<LibraryManga, "addedAt">): Promise<boolean> {
    try {
      const res = await fetch(`${BASE}/add`, {
        method:  "POST",
        headers: authHeaders(),
        body:    JSON.stringify({
          mangaId:     manga.mangaId ?? manga._id,
          title:       manga.title,
          author:      manga.author,
          coverImage:  manga.coverImage,
          status:      manga.status,
          genre:       manga.genre,
          rating:      manga.rating,
          year:        manga.year,
          description: manga.description,
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async remove(mangaId: string): Promise<boolean> {
    try {
      const res = await fetch(`${BASE}/${mangaId}`, {
        method:  "DELETE",
        headers: authHeaders(),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /** Toggles library state. Returns true if now in library, false if removed. */
  async toggle(manga: Omit<LibraryManga, "addedAt">): Promise<boolean> {
    const mangaId = manga.mangaId ?? manga._id;
    const inLib   = await libraryService.isInLibrary(mangaId);
    if (inLib) {
      await libraryService.remove(mangaId);
      return false;
    } else {
      await libraryService.add(manga);
      return true;
    }
  },
};