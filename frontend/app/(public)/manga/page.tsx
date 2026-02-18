"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ─── Mock data — replace with real API: GET /api/manga ────────────────────────
const ALL_MANGA = [
  { id: "1",  title: "One Piece",          author: "Eiichiro Oda",      genre: ["Adventure", "Action"],          status: "Ongoing",   rating: 9.4, chapters: 1124, gradient: "from-blue-500 to-cyan-400" },
  { id: "2",  title: "Jujutsu Kaisen",     author: "Gege Akutami",      genre: ["Action", "Dark Fantasy"],       status: "Ongoing",   rating: 8.9, chapters: 261,  gradient: "from-indigo-600 to-purple-500" },
  { id: "3",  title: "Chainsaw Man",       author: "Tatsuki Fujimoto",  genre: ["Dark Fantasy", "Action"],       status: "Ongoing",   rating: 9.1, chapters: 170,  gradient: "from-orange to-red" },
  { id: "4",  title: "Berserk",            author: "Kentaro Miura",     genre: ["Dark Fantasy", "Adventure"],    status: "Hiatus",    rating: 9.8, chapters: 374,  gradient: "from-gray-700 to-gray-900" },
  { id: "5",  title: "Vinland Saga",       author: "Makoto Yukimura",   genre: ["Historical", "Adventure"],      status: "Ongoing",   rating: 9.2, chapters: 210,  gradient: "from-amber-500 to-orange" },
  { id: "6",  title: "Attack on Titan",    author: "Hajime Isayama",    genre: ["Action", "Drama"],              status: "Completed", rating: 9.0, chapters: 139,  gradient: "from-stone-500 to-stone-700" },
  { id: "7",  title: "Demon Slayer",       author: "Koyoharu Gotouge",  genre: ["Action", "Adventure"],          status: "Completed", rating: 8.7, chapters: 205,  gradient: "from-pink-500 to-rose-600" },
  { id: "8",  title: "Solo Leveling",      author: "Chugong",           genre: ["Action", "Fantasy"],            status: "Completed", rating: 8.8, chapters: 179,  gradient: "from-violet-600 to-indigo-500" },
  { id: "9",  title: "My Hero Academia",   author: "Kōhei Horikoshi",   genre: ["Action", "Comedy"],             status: "Completed", rating: 8.2, chapters: 430,  gradient: "from-green-500 to-emerald-600" },
  { id: "10", title: "Tokyo Ghoul",        author: "Sui Ishida",        genre: ["Dark Fantasy", "Drama"],        status: "Completed", rating: 8.5, chapters: 179,  gradient: "from-red to-rose-900" },
  { id: "11", title: "Naruto",             author: "Masashi Kishimoto", genre: ["Action", "Adventure"],          status: "Completed", rating: 8.3, chapters: 700,  gradient: "from-orange to-yellow-400" },
  { id: "12", title: "Fullmetal Alchemist",author: "Hiromu Arakawa",    genre: ["Adventure", "Drama", "Fantasy"],status: "Completed", rating: 9.5, chapters: 108,  gradient: "from-yellow-500 to-amber-600" },
];

const ALL_GENRES = ["All", "Action", "Adventure", "Comedy", "Dark Fantasy", "Drama", "Fantasy", "Historical"];
const ALL_STATUSES = ["All", "Ongoing", "Completed", "Hiatus"];
const SORT_OPTIONS = [
  { value: "rating",   label: "Top Rated" },
  { value: "chapters", label: "Most Chapters" },
  { value: "title",    label: "A → Z" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-3 h-3 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

// Status pill colour
function statusColor(status: string) {
  if (status === "Ongoing")   return "bg-green-100 text-green-700";
  if (status === "Completed") return "bg-blue-100 text-blue-700";
  return "bg-amber-100 text-amber-700"; // Hiatus
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MangaBrowsePage() {
  const [query,        setQuery]        = useState("");
  const [activeGenre,  setActiveGenre]  = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [sortBy,       setSortBy]       = useState("rating");
  const [showFilters,  setShowFilters]  = useState(false);

  const filtered = useMemo(() => {
    let list = [...ALL_MANGA];

    // search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) => m.title.toLowerCase().includes(q) || m.author.toLowerCase().includes(q)
      );
    }

    // genre
    if (activeGenre !== "All") {
      list = list.filter((m) => m.genre.includes(activeGenre));
    }

    // status
    if (activeStatus !== "All") {
      list = list.filter((m) => m.status === activeStatus);
    }

    // sort
    if (sortBy === "rating")   list.sort((a, b) => b.rating   - a.rating);
    if (sortBy === "chapters") list.sort((a, b) => b.chapters  - a.chapters);
    if (sortBy === "title")    list.sort((a, b) => a.title.localeCompare(b.title));

    return list;
  }, [query, activeGenre, activeStatus, sortBy]);

  const activeFilterCount = (activeGenre !== "All" ? 1 : 0) + (activeStatus !== "All" ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* ── Page Hero ──────────────────────────────────────────────────────── */}
      <div className="relative bg-linear-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/40 font-semibold mb-6">
            <Link href="/dashboard" className="hover:text-white/70 transition-colors">Dashboard</Link>
            <span>›</span>
            <span className="text-white/70">Browse Manga</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
            Browse Manga
          </h1>
          <p className="text-white/40 text-sm mb-8 max-w-md">
            Discover thousands of titles across every genre. Your next obsession is one click away.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or author…"
              className="w-full bg-white/10 backdrop-blur border border-white/15 text-white placeholder:text-white/30 rounded-2xl py-3.5 pl-11 pr-5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange/50 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Filters + Sort Bar ─────────────────────────────────────────────── */}
      <div className="sticky top-[57px] z-30 bg-white/95 backdrop-blur border-b border-divider">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">

          {/* Genre tabs (desktop) */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {ALL_GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                className={`shrink-0 px-4 py-1.5 rounded-xl text-xs font-black transition-all duration-150 ${
                  activeGenre === g
                    ? "bg-linear-to-r from-orange to-red text-white shadow-sm shadow-orange/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-card"
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Right: filter toggle + sort */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                showFilters || activeFilterCount > 0
                  ? "border-orange text-orange bg-orange/5"
                  : "border-divider text-text-secondary hover:border-orange/40"
              }`}
            >
              <FilterIcon />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 bg-orange text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Status filter */}
            <div className="hidden md:flex items-center gap-1 border-l border-divider pl-3">
              {ALL_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveStatus(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all duration-150 ${
                    activeStatus === s
                      ? "bg-text-primary text-white"
                      : "text-text-secondary hover:text-text-primary hover:bg-card"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-black text-text-primary bg-card border border-divider rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange/30 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile expanded filters */}
        {showFilters && (
          <div className="md:hidden border-t border-divider px-6 py-3 space-y-3 bg-white">
            <div>
              <p className="text-[9px] font-black text-text-secondary tracking-widest uppercase mb-2">Genre</p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setActiveGenre(g)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      activeGenre === g
                        ? "bg-linear-to-r from-orange to-red text-white"
                        : "bg-card text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[9px] font-black text-text-secondary tracking-widest uppercase mb-2">Status</p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveStatus(s)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      activeStatus === s
                        ? "bg-text-primary text-white"
                        : "bg-card text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Results ────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Result count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-bold text-text-secondary">
            {filtered.length === ALL_MANGA.length
              ? `${ALL_MANGA.length} titles`
              : `${filtered.length} of ${ALL_MANGA.length} titles`}
            {query && <span className="text-orange"> for "{query}"</span>}
          </p>
          {(query || activeGenre !== "All" || activeStatus !== "All") && (
            <button
              onClick={() => { setQuery(""); setActiveGenre("All"); setActiveStatus("All"); }}
              className="text-xs font-black text-red hover:underline underline-offset-4"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-xl font-black text-text-primary mb-2">No results found</p>
            <p className="text-text-secondary text-sm">Try adjusting your search or filters</p>
            <button
              onClick={() => { setQuery(""); setActiveGenre("All"); setActiveStatus("All"); }}
              className="mt-6 px-6 py-2.5 bg-linear-to-r from-orange to-red text-white font-black text-sm rounded-xl shadow-md shadow-orange/20 hover:scale-105 transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {filtered.map((manga) => (
              <Link key={manga.id} href={`/manga/${manga.id}`}>
                <div className="group cursor-pointer">
                  {/* Cover */}
                  <div className={`relative aspect-[3/4] rounded-2xl overflow-hidden bg-linear-to-br ${manga.gradient} shadow-sm group-hover:shadow-xl group-hover:shadow-black/15 group-hover:scale-[1.03] transition-all duration-300`}>
                    {/* Placeholder art texture */}
                    <div className="absolute inset-0 opacity-10"
                      style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl opacity-20 select-none">📕</span>
                    </div>

                    {/* Status badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${statusColor(manga.status)}`}>
                        {manga.status}
                      </span>
                    </div>

                    {/* Rating badge */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur px-1.5 py-0.5 rounded-full">
                      <StarIcon />
                      <span className="text-[10px] font-black text-white">{manga.rating}</span>
                    </div>

                    {/* Bottom gradient overlay with chapter count */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-black/70 to-transparent flex items-end px-2.5 pb-2">
                      <span className="text-[10px] font-bold text-white/70">
                        {manga.chapters} ch.
                      </span>
                    </div>
                  </div>

                  {/* Info below cover */}
                  <div className="mt-2.5 px-0.5">
                    <p className="text-[13px] font-black text-text-primary leading-tight line-clamp-2 group-hover:text-orange transition-colors duration-150">
                      {manga.title}
                    </p>
                    <p className="text-[11px] text-text-secondary mt-0.5 truncate">{manga.author}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {manga.genre.slice(0, 2).map((g) => (
                        <span key={g} className="text-[9px] font-bold text-text-secondary bg-card px-1.5 py-0.5 rounded-md">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}