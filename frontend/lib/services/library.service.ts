// lib/services/library.service.ts
// Persists library to localStorage so it works client-side without a backend endpoint.
// Swap the storage calls for real API requests when your backend is ready.

const LIBRARY_KEY = "ink_scratch_library";

export interface LibraryManga {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
  status: string;
  genre: string[];
  rating: number;
  year?: number;
  description?: string;
  addedAt: string; // ISO date string
}

function readStore(): LibraryManga[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LIBRARY_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeStore(items: LibraryManga[]): void {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(items));
}

export const libraryService = {
  getAll(): LibraryManga[] {
    return readStore();
  },

  isInLibrary(mangaId: string): boolean {
    return readStore().some((m) => m._id === mangaId);
  },

  add(manga: LibraryManga): void {
    const current = readStore();
    if (!current.some((m) => m._id === manga._id)) {
      writeStore([{ ...manga, addedAt: new Date().toISOString() }, ...current]);
    }
  },

  remove(mangaId: string): void {
    writeStore(readStore().filter((m) => m._id !== mangaId));
  },

  toggle(manga: LibraryManga): boolean {
    if (libraryService.isInLibrary(manga._id)) {
      libraryService.remove(manga._id);
      return false; // removed
    } else {
      libraryService.add(manga);
      return true; // added
    }
  },
};