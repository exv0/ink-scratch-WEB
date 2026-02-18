"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock manga data - replace with real API call: GET /api/manga/:id
const MOCK_MANGA = {
  id: "1",
  title: "One Piece",
  author: "Eiichiro Oda",
  genre: ["Adventure", "Action", "Comedy"],
  status: "Ongoing",
  rating: 9.4,
  description:
    "Monkey D. Luffy refuses to let anyone or anything stand in the way of his quest to become the king of all pirates. With a course charted for the treacherous waters of the Grand Line and beyond, this is one captain who'll never give up until he's claimed the greatest treasure on Earth.",
  coverGradient: "from-blue-500 via-cyan-400 to-teal-500",
  chapters: [
    { id: "c1124", number: 1124, title: "The Last Island", date: "2 days ago", isNew: true },
    { id: "c1123", number: 1123, title: "Gear 6", date: "1 week ago", isNew: false },
    { id: "c1122", number: 1122, title: "The Final Battle", date: "2 weeks ago", isNew: false },
    { id: "c1121", number: 1121, title: "Joy Boy Returns", date: "3 weeks ago", isNew: false },
    { id: "c1120", number: 1120, title: "Will of D", date: "1 month ago", isNew: false },
  ],
  stats: { chapters: 1124, readers: "42M", rating: 9.4, year: 1999 },
};

type Tab = "chapters" | "about";

export default function MangaDetailPage() {
  const params = useParams();
  const [tab, setTab] = useState<Tab>("chapters");
  const [inLibrary, setInLibrary] = useState(false);
  const manga = MOCK_MANGA; // Replace: const manga = await fetchManga(params.id)

  return (
    <div className="min-h-screen bg-gray-50 pb-16">

      {/* Hero */}
      <div className={`relative bg-linear-to-br ${manga.coverGradient} overflow-hidden`}>
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIi8+PC9zdmc+')]" />
        <div className="absolute inset-0 bg-black/30" />

        {/* Breadcrumb */}
        <div className="relative max-w-5xl mx-auto px-6 pt-6">
          <nav className="flex items-center gap-2 text-xs text-white/60 font-semibold">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <span>›</span>
            <Link href="/manga" className="hover:text-white transition-colors">Browse</Link>
            <span>›</span>
            <span className="text-white">{manga.title}</span>
          </nav>
        </div>

        {/* Main hero content */}
        <div className="relative max-w-5xl mx-auto px-6 py-10 flex gap-8 items-end">
          {/* Cover */}
          <div className="shrink-0 hidden sm:block">
            <div className="w-36 md:w-44 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-white/10 backdrop-blur flex items-center justify-center">
              <span className="text-7xl opacity-40">📕</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {manga.genre.map((g) => (
                <span key={g} className="text-[10px] font-black text-white/80 bg-white/15 backdrop-blur px-2.5 py-0.5 rounded-full tracking-wider">
                  {g}
                </span>
              ))}
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full tracking-wider ${
                manga.status === "Ongoing"
                  ? "bg-green-500/80 text-white"
                  : "bg-white/20 text-white/80"
              }`}>
                {manga.status}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-1">
              {manga.title}
            </h1>
            <p className="text-white/60 text-sm font-semibold mb-4">by {manga.author}</p>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-6">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-white font-black text-lg">{manga.stats.rating}</span>
              <span className="text-white/40 text-sm">/ 10</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 flex-wrap">
              <Link href={`/manga/${params.id}/read/${manga.chapters[0].id}`}>
                <button className="px-6 py-2.5 bg-white text-text-primary font-black text-sm rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200">
                  📖 Start Reading
                </button>
              </Link>
              <button
                onClick={() => setInLibrary((v) => !v)}
                className={`px-6 py-2.5 font-black text-sm rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                  inLibrary
                    ? "bg-white/20 border-white/40 text-white backdrop-blur"
                    : "bg-transparent border-white/40 text-white/80 hover:bg-white/10"
                }`}
              >
                {inLibrary ? "✓ In Library" : "+ Add to Library"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/15 bg-black/20 backdrop-blur">
          <div className="max-w-5xl mx-auto px-6 py-3 grid grid-cols-4 divide-x divide-white/15">
            {[
              { label: "Chapters", value: manga.stats.chapters.toLocaleString() },
              { label: "Readers", value: manga.stats.readers },
              { label: "Rating", value: `${manga.stats.rating}/10` },
              { label: "Since", value: manga.stats.year },
            ].map((s) => (
              <div key={s.label} className="text-center px-4">
                <p className="text-white font-black text-lg leading-none">{s.value}</p>
                <p className="text-white/40 text-[10px] font-semibold mt-0.5 tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="max-w-5xl mx-auto px-6">
        {/* Tab Bar */}
        <div className="flex border-b border-divider mt-6 gap-1">
          {(["chapters", "about"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-black tracking-wide capitalize transition-colors border-b-2 -mb-px ${
                tab === t
                  ? "text-orange border-orange"
                  : "text-text-secondary border-transparent hover:text-text-primary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Chapters Tab */}
        {tab === "chapters" && (
          <div className="mt-4 space-y-2">
            {manga.chapters.map((ch) => (
              <Link key={ch.id} href={`/manga/${params.id}/read/${ch.id}`}>
                <div className="flex items-center justify-between px-5 py-4 bg-white rounded-2xl border border-divider hover:border-orange/30 hover:shadow-md hover:shadow-orange/5 group cursor-pointer transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      ch.isNew
                        ? "bg-linear-to-br from-orange to-red"
                        : "bg-card"
                    }`}>
                      <span className={`text-sm font-black ${ch.isNew ? "text-white" : "text-text-secondary"}`}>
                        {ch.number}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-text-primary group-hover:text-orange transition-colors">
                          Chapter {ch.number}: {ch.title}
                        </p>
                        {ch.isNew && (
                          <span className="text-[9px] font-black bg-linear-to-r from-orange to-red text-white px-1.5 py-0.5 rounded-full tracking-widest uppercase">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5">{ch.date}</p>
                    </div>
                  </div>
                  <span className="text-text-secondary group-hover:text-orange transition-colors text-lg">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* About Tab */}
        {tab === "about" && (
          <div className="mt-6 bg-white rounded-2xl border border-divider p-6">
            <h3 className="text-lg font-black text-text-primary mb-3">Synopsis</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{manga.description}</p>

            <div className="mt-6 pt-6 border-t border-divider grid grid-cols-2 gap-4">
              {[
                { label: "Author", value: manga.author },
                { label: "Status", value: manga.status },
                { label: "Genres", value: manga.genre.join(", ") },
                { label: "Published", value: manga.stats.year.toString() },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{f.label}</p>
                  <p className="text-sm font-semibold text-text-primary mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}