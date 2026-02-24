// lib/reading-tracker.ts
// Utilities to track reading history and library in localStorage.
// Call these from the manga detail page and chapter reader page.

const LS_HISTORY_KEY = "ink_reading_history";
const LS_LIBRARY_KEY = "ink_library";

export interface ReadingEntry {
  mangaId: string;
  title: string;
  coverImage: string;
  chapterId: string;
  chapterNumber: number;
  progress: number; // 0–100
  updatedAt: number;
}

export interface LibraryEntry {
  mangaId: string;
  title: string;
  coverImage: string;
  addedAt: number;
}

// ── Reading History ────────────────────────────────────────────────────────────

export function getHistory(): ReadingEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LS_HISTORY_KEY) || "[]");
  } catch { return []; }
}

/**
 * Call this when the user opens a chapter or updates their reading progress.
 */
export function updateHistory(entry: Omit<ReadingEntry, "updatedAt">) {
  const history = getHistory().filter(e => e.mangaId !== entry.mangaId);
  history.unshift({ ...entry, updatedAt: Date.now() });
  // Keep only the 50 most recent entries
  localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
}

/**
 * Update just the progress percentage for a manga already in history.
 */
export function updateProgress(mangaId: string, progress: number) {
  const history = getHistory();
  const idx = history.findIndex(e => e.mangaId === mangaId);
  if (idx !== -1) {
    history[idx].progress = Math.min(100, Math.max(0, progress));
    history[idx].updatedAt = Date.now();
    localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(history));
  }
}

// ── Library ────────────────────────────────────────────────────────────────────

export function getLibrary(): LibraryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LS_LIBRARY_KEY) || "[]");
  } catch { return []; }
}

export function isInLibrary(mangaId: string): boolean {
  return getLibrary().some(e => e.mangaId === mangaId);
}

/**
 * Toggle a manga in/out of the library. Returns the new state (true = added).
 */
export function toggleLibrary(entry: Omit<LibraryEntry, "addedAt">): boolean {
  const library = getLibrary();
  const idx = library.findIndex(e => e.mangaId === entry.mangaId);
  if (idx !== -1) {
    library.splice(idx, 1);
    localStorage.setItem(LS_LIBRARY_KEY, JSON.stringify(library));
    return false;
  } else {
    library.unshift({ ...entry, addedAt: Date.now() });
    localStorage.setItem(LS_LIBRARY_KEY, JSON.stringify(library));
    return true;
  }
}