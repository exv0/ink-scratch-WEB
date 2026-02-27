// frontend/lib/services/history.service.ts

import { API_BASE_URL } from "../config";

const BASE = `${API_BASE_URL}/api/history`;

export interface ReadingHistoryEntry {
  mangaId:       string;
  title:         string;
  coverImage?:   string;
  chapterId:     string;
  chapterNumber: number;
  chapterTitle?: string;
  progress:      number; // 0–100
  updatedAt:     string; // ISO date string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function authHeaders(): HeadersInit {
  if (typeof document === "undefined") return { "Content-Type": "application/json" };
  const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
  const token = match ? match[1] : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ── Service ───────────────────────────────────────────────────────────────────

export const historyService = {

  async getAll(): Promise<ReadingHistoryEntry[]> {
    try {
      const res = await fetch(BASE, { headers: authHeaders() });
      if (!res.ok) return [];
      const json = await res.json();
      return json.data ?? [];
    } catch {
      return [];
    }
  },

  async update(entry: Omit<ReadingHistoryEntry, "updatedAt">): Promise<boolean> {
    try {
      const res = await fetch(`${BASE}/update`, {
        method:  "POST",
        headers: authHeaders(),
        body:    JSON.stringify(entry),
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

  async clear(): Promise<boolean> {
    try {
      const res = await fetch(BASE, {
        method:  "DELETE",
        headers: authHeaders(),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};