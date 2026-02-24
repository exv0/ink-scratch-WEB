"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { mangaService, Manga, Chapter } from "@/lib/services/manga.service";
type Tab = "chapters" | "about";

function statusColor(status: string) {
  if (status === "Ongoing")   return "bg-green-500/80 text-white";
  if (status === "Completed") return "bg-blue-500/80 text-white";
  if (status === "Cancelled") return "bg-red-500/80 text-white";
  return "bg-white/20 text-white/80";
}

function CoverImage({ manga }: { manga: Manga }) {
  const [imgError, setImgError] = useState(false);
  if (manga.coverImage && !imgError) {
    return <img src={manga.coverImage} alt={manga.title} className="w-full h-full object-cover" onError={() => setImgError(true)} />;
  }
  return <div className="w-full h-full bg-white/10 flex items-center justify-center"><span className="text-7xl opacity-40">📕</span></div>;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export default function MangaDetailPage() {
  const params  = useParams();
  const id      = params.id as string;

  const [manga,     setManga]     = useState<Manga | null>(null);
  const [chapters,  setChapters]  = useState<Chapter[]>([]);
  const [tab,       setTab]       = useState<Tab>("chapters");
  const [inLibrary, setInLibrary] = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [mangaRes, chaptersRes] = await Promise.all([
          mangaService.getById(id),
          mangaService.getChapters(id),
        ]);
        setManga(mangaRes.data);
        setChapters(chaptersRes.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="h-72 bg-gray-300" />
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !manga) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">⚠️</p>
        <p className="text-xl font-black text-gray-800 mb-2">Failed to load manga</p>
        <p className="text-gray-500 text-sm mb-6">{error}</p>
        <Link href="/manga"><button className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-sm rounded-xl">Back to Browse</button></Link>
      </div>
    </div>
  );

  const latestChapter  = chapters[chapters.length - 1];
  const firstChapter   = chapters[0];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden">
        {/* Blurred cover bg */}
        {manga.coverImage && (
          <div className="absolute inset-0 opacity-20">
            <img src={manga.coverImage} alt="" className="w-full h-full object-cover blur-2xl scale-110" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative max-w-5xl mx-auto px-6 pt-6">
          <nav className="flex items-center gap-2 text-xs text-white/60 font-semibold">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <span>›</span>
            <Link href="/manga" className="hover:text-white transition-colors">Browse</Link>
            <span>›</span>
            <span className="text-white truncate max-w-[200px]">{manga.title}</span>
          </nav>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-10 flex gap-8 items-end">
          {/* Cover */}
          <div className="shrink-0 hidden sm:block">
            <div className="w-36 md:w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
              <CoverImage manga={manga} />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {manga.genre.slice(0, 4).map(g => (
                <span key={g} className="text-[10px] font-black text-white/80 bg-white/15 backdrop-blur px-2.5 py-0.5 rounded-full tracking-wider">{g}</span>
              ))}
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wider ${statusColor(manga.status)}`}>{manga.status}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-1">{manga.title}</h1>
            <p className="text-white/60 text-sm font-semibold mb-4">by {manga.author}</p>
            {manga.rating > 0 && (
              <div className="flex items-center gap-1.5 mb-6">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="text-white font-black text-lg">{manga.rating.toFixed(1)}</span>
                <span className="text-white/40 text-sm">/ 10</span>
              </div>
            )}
            <div className="flex gap-3 flex-wrap">
              {firstChapter && (
                <Link href={`/manga/${id}/read/${firstChapter._id}`}>
                  <button className="px-6 py-2.5 bg-white text-gray-900 font-black text-sm rounded-xl shadow-lg hover:scale-105 transition-all">
                    📖 Start Reading
                  </button>
                </Link>
              )}
              {latestChapter && latestChapter._id !== firstChapter?._id && (
                <Link href={`/manga/${id}/read/${latestChapter._id}`}>
                  <button className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-sm rounded-xl shadow-lg hover:scale-105 transition-all">
                    ⚡ Latest Chapter
                  </button>
                </Link>
              )}
              <button
                onClick={() => setInLibrary(v => !v)}
                className={`px-6 py-2.5 font-black text-sm rounded-xl border-2 transition-all hover:scale-105 ${
                  inLibrary ? "bg-white/20 border-white/40 text-white" : "bg-transparent border-white/40 text-white/80 hover:bg-white/10"
                }`}
              >
                {inLibrary ? "✓ In Library" : "+ Add to Library"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative border-t border-white/15 bg-black/20 backdrop-blur">
          <div className="max-w-5xl mx-auto px-6 py-3 grid grid-cols-4 divide-x divide-white/15">
            {[
              { label: "Chapters", value: chapters.length.toLocaleString() },
              { label: "Status",   value: manga.status },
              { label: "Rating",   value: manga.rating > 0 ? `${manga.rating.toFixed(1)}/10` : "N/A" },
              { label: "Year",     value: manga.year ?? "N/A" },
            ].map(s => (
              <div key={s.label} className="text-center px-4">
                <p className="text-white font-black text-lg leading-none">{s.value}</p>
                <p className="text-white/40 text-[10px] font-semibold mt-0.5 tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex border-b border-gray-200 mt-6 gap-1">
          {(["chapters", "about"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-black tracking-wide capitalize transition-colors border-b-2 -mb-px ${
                tab === t ? "text-orange-500 border-orange-500" : "text-gray-400 border-transparent hover:text-gray-800"
              }`}
            >{t} {t === "chapters" && `(${chapters.length})`}</button>
          ))}
        </div>

        {/* Chapters tab */}
        {tab === "chapters" && (
          <div className="mt-4 space-y-2">
            {chapters.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">📂</p>
                <p className="font-black text-gray-800">No chapters yet</p>
                <p className="text-gray-400 text-sm mt-1">Chapters are being imported in the background</p>
              </div>
            ) : (
              [...chapters].reverse().map((ch, i) => (
                <Link key={ch._id} href={`/manga/${id}/read/${ch._id}`}>
                  <div className="flex items-center justify-between px-5 py-4 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md group cursor-pointer transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        i === 0 ? "bg-gradient-to-br from-orange-500 to-red-500" : "bg-gray-100"
                      }`}>
                        <span className={`text-sm font-black ${i === 0 ? "text-white" : "text-gray-500"}`}>
                          {ch.chapterNumber}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-gray-900 group-hover:text-orange-500 transition-colors">
                            Chapter {ch.chapterNumber}{ch.title ? `: ${ch.title}` : ""}
                          </p>
                          {i === 0 && (
                            <span className="text-[9px] font-black bg-gradient-to-r from-orange-500 to-red-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-widest">
                              Latest
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{timeAgo(ch.publishedAt || ch.createdAt)}</p>
                      </div>
                    </div>
                    <span className="text-gray-300 group-hover:text-orange-500 transition-colors text-lg">→</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* About tab */}
        {tab === "about" && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-black text-gray-900 mb-3">Synopsis</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {manga.description || "No description available."}
            </p>
            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
              {[
                { label: "Author",  value: manga.author },
                { label: "Artist",  value: manga.artist },
                { label: "Status",  value: manga.status },
                { label: "Genres",  value: manga.genre.join(", ") || "N/A" },
                { label: "Year",    value: manga.year?.toString() ?? "N/A" },
                { label: "Source",  value: "MangaDex" },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}