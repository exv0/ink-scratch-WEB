"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { mangaService, Manga } from "@/lib/services/manga.service";

// ── localStorage helpers ───────────────────────────────────────────────────────
const LS_HISTORY_KEY = "ink_reading_history";
const LS_LIBRARY_KEY = "ink_library";

interface ReadingEntry {
  mangaId: string;
  title: string;
  coverImage: string;
  chapterId: string;
  chapterNumber: number;
  progress: number; // 0-100
  updatedAt: number;
}

interface LibraryEntry {
  mangaId: string;
  title: string;
  coverImage: string;
  addedAt: number;
}

function getHistory(): ReadingEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LS_HISTORY_KEY) || "[]");
  } catch { return []; }
}

function getLibrary(): LibraryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LS_LIBRARY_KEY) || "[]");
  } catch { return []; }
}

// ── Cover with fallback ────────────────────────────────────────────────────────
function Cover({ src, title, className }: { src?: string; title: string; className?: string }) {
  const [err, setErr] = useState(false);
  const colors = [
    "from-orange-500 to-red-500", "from-indigo-500 to-purple-600",
    "from-blue-500 to-cyan-500", "from-green-500 to-emerald-600",
    "from-pink-500 to-rose-600", "from-amber-500 to-orange-500",
  ];
  const g = colors[title.charCodeAt(0) % colors.length];

  if (src && !err) {
    return <img src={src} alt={title} className={className} onError={() => setErr(true)} />;
  }
  return (
    <div className={`${className} bg-gradient-to-br ${g} flex items-center justify-center`}>
      <span className="text-4xl opacity-20 select-none">📕</span>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />;
}

// ── Greeting ───────────────────────────────────────────────────────────────────
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [featured,   setFeatured]   = useState<Manga[]>([]);
  const [topRated,   setTopRated]   = useState<Manga[]>([]);
  const [latest,     setLatest]     = useState<Manga[]>([]);
  const [history,    setHistory]    = useState<ReadingEntry[]>([]);
  const [library,    setLibrary]    = useState<LibraryEntry[]>([]);
  const [mangaLoad,  setMangaLoad]  = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isLoading, router]);

  // Load localStorage data
  useEffect(() => {
    setHistory(getHistory().sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 6));
    setLibrary(getLibrary().sort((a, b) => b.addedAt - a.addedAt).slice(0, 8));
  }, []);

  // Fetch real manga data
  const fetchManga = useCallback(async () => {
    setMangaLoad(true);
    try {
      const [topRes, latestRes, randomRes] = await Promise.all([
        mangaService.getAll({ page: 1, limit: 6, sort: "rating" }),
        mangaService.getAll({ page: 1, limit: 6, sort: "latest" }),
        mangaService.getAll({ page: 1, limit: 4, sort: "rating" }),
      ]);
      setTopRated(topRes.data);
      setLatest(latestRes.data);
      // Pick random featured from top rated
      const pool = topRes.data;
      setFeatured(pool.sort(() => Math.random() - 0.5).slice(0, 3));
    } catch (e) {
      console.error("Failed to fetch manga", e);
    } finally {
      setMangaLoad(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchManga();
  }, [isAuthenticated, fetchManga]);

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-sm font-semibold">Loading your library…</p>
      </div>
    </div>
  );

  if (!isAuthenticated) return null;

  const displayName = user?.fullName || user?.username || "Reader";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16">
          <p className="text-orange-400/80 font-bold text-xs tracking-widest uppercase mb-2">{greeting()}</p>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
            {displayName} 👋
          </h1>
          <p className="text-white/40 text-sm max-w-md mb-8">
            {history.length > 0
              ? `You have ${history.length} stor${history.length === 1 ? "y" : "ies"} in progress. Keep the adventure going!`
              : "Start reading to track your progress here."}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
            {[
              { label: "In Progress",   value: history.length,   icon: "📖" },
              { label: "In Library",    value: library.length,   icon: "📚" },
              { label: "Top Rated",     value: topRated.length,  icon: "⭐" },
              { label: "Latest Added",  value: latest.length,    icon: "🆕" },
            ].map(s => (
              <div key={s.label} className="bg-white/8 backdrop-blur border border-white/10 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{s.icon}</span>
                  <span className="text-2xl font-black text-white">{s.value}</span>
                </div>
                <p className="text-white/40 text-[11px] font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-14">

        {/* ── Continue Reading ──────────────────────────────────────────── */}
        <section>
          <SectionHeader title="Continue Reading" sub="Pick up right where you left off" href="/manga" />
          {history.length === 0 ? (
            <EmptyState
              icon="📖"
              message="No reading history yet"
              sub="Start reading a manga and it'll appear here automatically"
              href="/manga"
              cta="Browse Manga"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {history.map(entry => (
                <Link key={entry.mangaId} href={`/manga/${entry.mangaId}/read/${entry.chapterId}`}>
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-orange-200 transition-all duration-300 overflow-hidden group cursor-pointer">
                    <div className="relative h-44 overflow-hidden">
                      <Cover
                        src={entry.coverImage}
                        title={entry.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                        <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                          style={{ width: `${entry.progress}%` }} />
                      </div>
                      <div className="absolute bottom-3 left-4 right-4">
                        <p className="text-white font-black text-sm leading-tight line-clamp-1">{entry.title}</p>
                        <p className="text-white/60 text-xs mt-0.5">Chapter {entry.chapterNumber}</p>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-400">{entry.progress}% complete</span>
                      <span className="text-xs font-black text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-all">
                        Continue →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── Featured / Random ─────────────────────────────────────────── */}
        <section>
          <SectionHeader title="Featured Today" sub="Handpicked titles you might enjoy" href="/manga" />
          {mangaLoad ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featured.map((m, i) => (
                <Link key={m._id} href={`/manga/${m._id}`}>
                  <div className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
                    <Cover src={m.coverImage} title={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {i === 0 && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full tracking-wider uppercase">
                        Featured
                      </div>
                    )}
                    {m.rating > 0 && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur px-2 py-0.5 rounded-full">
                        <span className="text-yellow-400 text-[10px]">★</span>
                        <span className="text-white text-[10px] font-black">{m.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {m.genre.slice(0, 2).map(g => (
                          <span key={g} className="text-[9px] font-black text-white/70 bg-white/15 backdrop-blur px-2 py-0.5 rounded-full">{g}</span>
                        ))}
                      </div>
                      <p className="text-white font-black text-base leading-tight line-clamp-2">{m.title}</p>
                      <p className="text-white/50 text-xs mt-1">by {m.author}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ── Top Rated ─────────────────────────────────────────────────── */}
        <section>
          <SectionHeader title="Top Rated" sub="The best manga in the library" href="/manga" />
          <MangaRow manga={topRated} loading={mangaLoad} />
        </section>

        {/* ── Recently Updated ──────────────────────────────────────────── */}
        <section>
          <SectionHeader title="Recently Updated" sub="Fresh chapters just added" href="/manga" />
          <MangaRow manga={latest} loading={mangaLoad} />
        </section>

        {/* ── My Library ────────────────────────────────────────────────── */}
        <section>
          <SectionHeader title="My Library" sub="Your saved titles" href="/manga" />
          {library.length === 0 ? (
            <EmptyState
              icon="📚"
              message="Your library is empty"
              sub='Hit "+ Add to Library" on any manga page to save it here'
              href="/manga"
              cta="Browse Manga"
            />
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {library.map(entry => (
                <Link key={entry.mangaId} href={`/manga/${entry.mangaId}`}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                      <Cover src={entry.coverImage} title={entry.title} className="w-full h-full object-cover" />
                    </div>
                    <p className="mt-2 text-xs font-bold text-gray-700 truncate leading-tight group-hover:text-orange-500 transition-colors">
                      {entry.title}
                    </p>
                  </div>
                </Link>
              ))}
              <Link href="/manga">
                <div className="group cursor-pointer">
                  <div className="aspect-[3/4] rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center group-hover:border-orange-400/50 group-hover:bg-orange-50 transition-all duration-200">
                    <span className="text-2xl text-gray-300 group-hover:text-orange-400 transition-colors">+</span>
                  </div>
                  <p className="mt-2 text-xs font-bold text-gray-400 truncate">Add More</p>
                </div>
              </Link>
            </div>
          )}
        </section>

        {/* ── Browse CTA ────────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl p-10 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-2">Discover new stories</h3>
            <p className="text-white/40 mb-7 text-sm">Thousands of manga titles waiting for you</p>
            <Link href="/manga">
              <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black rounded-xl shadow-lg shadow-orange-500/25 hover:scale-105 hover:shadow-orange-500/40 transition-all duration-200">
                Browse All Titles →
              </button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function SectionHeader({ title, sub, href }: { title: string; sub: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900">{title}</h2>
        <p className="text-gray-400 text-sm mt-0.5">{sub}</p>
      </div>
      <Link href={href} className="text-sm font-black text-orange-500 hover:underline underline-offset-4">
        Browse More →
      </Link>
    </div>
  );
}

function EmptyState({ icon, message, sub, href, cta }: { icon: string; message: string; sub: string; href: string; cta: string }) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
      <p className="text-4xl mb-3">{icon}</p>
      <p className="font-black text-gray-800 mb-1">{message}</p>
      <p className="text-gray-400 text-sm mb-5 max-w-xs mx-auto">{sub}</p>
      <Link href={href}>
        <button className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-sm rounded-xl">
          {cta}
        </button>
      </Link>
    </div>
  );
}

function MangaRow({ manga, loading }: { manga: Manga[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] rounded-xl bg-gray-200" />
            <div className="mt-2 h-3 bg-gray-200 rounded w-3/4" />
            <div className="mt-1 h-3 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {manga.map(m => (
        <Link key={m._id} href={`/manga/${m._id}`}>
          <div className="group cursor-pointer">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm group-hover:shadow-lg group-hover:scale-[1.03] transition-all duration-300">
              <Cover src={m.coverImage} title={m.title} className="w-full h-full object-cover" />
              {m.rating > 0 && (
                <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/50 backdrop-blur px-1.5 py-0.5 rounded-full">
                  <span className="text-yellow-400 text-[9px]">★</span>
                  <span className="text-white text-[9px] font-black">{m.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs font-black text-gray-900 line-clamp-2 leading-tight group-hover:text-orange-500 transition-colors">{m.title}</p>
            <p className="text-[11px] text-gray-400 mt-0.5 truncate">{m.author}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}