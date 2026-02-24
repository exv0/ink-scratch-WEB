"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { mangaService, Manga } from "@/lib/services/manga.service";
const ALL_GENRES   = ["All", "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural"];
const ALL_STATUSES = ["All", "Ongoing", "Completed", "Hiatus", "Cancelled"];
const SORT_OPTIONS = [
  { value: "rating",   label: "Top Rated"     },
  { value: "latest",   label: "Latest"        },
  { value: "chapters", label: "Most Chapters" },
  { value: "title",    label: "A → Z"         },
];

// ── Icons ─────────────────────────────────────────────────────────────────────
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

function statusColor(status: string) {
  if (status === "Ongoing")   return "bg-green-100 text-green-700";
  if (status === "Completed") return "bg-blue-100 text-blue-700";
  if (status === "Cancelled") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
}

// ── Cover image with fallback ─────────────────────────────────────────────────
function MangaCover({ manga }: { manga: Manga }) {
  const [imgError, setImgError] = useState(false);

  if (manga.coverImage && !imgError) {
    return (
      <img
        src={manga.coverImage}
        alt={manga.title}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  }

  // Fallback gradient placeholder
  const colors = ["from-blue-500 to-cyan-400", "from-indigo-600 to-purple-500",
    "from-orange-500 to-red-500", "from-gray-700 to-gray-900",
    "from-amber-500 to-orange-500", "from-pink-500 to-rose-600"];
  const gradient = colors[manga.title.charCodeAt(0) % colors.length];

  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
      <span className="text-5xl opacity-20 select-none">📕</span>
    </div>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-2xl bg-gray-200" />
      <div className="mt-2.5 space-y-1.5">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MangaBrowsePage() {
  const [manga,        setManga]        = useState<Manga[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [query,        setQuery]        = useState("");
  const [searching,    setSearching]    = useState(false);
  const [activeGenre,  setActiveGenre]  = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [sortBy,       setSortBy]       = useState("rating");
  const [showFilters,  setShowFilters]  = useState(false);
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [total,        setTotal]        = useState(0);

  // ── Fetch manga list ────────────────────────────────────────────────────────
  const fetchManga = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await mangaService.getAll({
        page,
        limit: 24,
        genre:  activeGenre,
        status: activeStatus,
        sort:   sortBy,
      });
      setManga(res.data);
      setTotalPages(res.pagination.pages);
      setTotal(res.pagination.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, activeGenre, activeStatus, sortBy]);

  useEffect(() => { fetchManga(); }, [fetchManga]);

  // ── Search with debounce ────────────────────────────────────────────────────
  useEffect(() => {
    if (!query.trim()) { fetchManga(); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await mangaService.search(query);
        setManga(res.data);
        setTotalPages(1);
        setTotal(res.data.length);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [activeGenre, activeStatus, sortBy]);

  const activeFilterCount = (activeGenre !== "All" ? 1 : 0) + (activeStatus !== "All" ? 1 : 0);
  const isLoading = loading || searching;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <nav className="flex items-center gap-2 text-xs text-white/40 font-semibold mb-6">
            <Link href="/dashboard" className="hover:text-white/70 transition-colors">Dashboard</Link>
            <span>›</span>
            <span className="text-white/70">Browse Manga</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Browse Manga</h1>
          <p className="text-white/40 text-sm mb-8 max-w-md">
            {total > 0 ? `${total.toLocaleString()} titles in your library` : "Discover manga across every genre"}
          </p>
          {/* Search */}
          <div className="relative max-w-xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"><SearchIcon /></span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or author…"
              className="w-full bg-white/10 backdrop-blur border border-white/15 text-white placeholder:text-white/30 rounded-2xl py-3.5 pl-11 pr-5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
            />
            {(query || isLoading) && (
              <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 text-lg">
                {isLoading ? <span className="text-sm animate-spin inline-block">⟳</span> : "×"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-1 overflow-x-auto">
            {ALL_GENRES.map((g) => (
              <button key={g} onClick={() => setActiveGenre(g)}
                className={`shrink-0 px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                  activeGenre === g
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >{g}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <button onClick={() => setShowFilters(v => !v)}
              className={`md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                showFilters || activeFilterCount > 0 ? "border-orange-500 text-orange-500" : "border-gray-200 text-gray-500"
              }`}
            >
              <FilterIcon /> Filters
              {activeFilterCount > 0 && <span className="w-4 h-4 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{activeFilterCount}</span>}
            </button>
            <div className="hidden md:flex items-center gap-1 border-l border-gray-200 pl-3">
              {ALL_STATUSES.map((s) => (
                <button key={s} onClick={() => setActiveStatus(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                    activeStatus === s ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >{s}</button>
              ))}
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-black text-gray-800 bg-gray-100 border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
        {showFilters && (
          <div className="md:hidden border-t border-gray-200 px-6 py-3 space-y-3 bg-white">
            <div>
              <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase mb-2">Genre</p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_GENRES.map(g => (
                  <button key={g} onClick={() => setActiveGenre(g)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      activeGenre === g ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >{g}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase mb-2">Status</p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_STATUSES.map(s => (
                  <button key={s} onClick={() => setActiveStatus(s)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      activeStatus === s ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-bold text-gray-500">
            {isLoading ? "Loading..." : `${total.toLocaleString()} titles`}
            {query && <span className="text-orange-500"> for "{query}"</span>}
          </p>
          {(query || activeGenre !== "All" || activeStatus !== "All") && (
            <button onClick={() => { setQuery(""); setActiveGenre("All"); setActiveStatus("All"); }}
              className="text-xs font-black text-red-500 hover:underline"
            >Clear all</button>
          )}
        </div>

        {error ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">⚠️</p>
            <p className="text-xl font-black text-gray-800 mb-2">Failed to load manga</p>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button onClick={fetchManga} className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-sm rounded-xl">
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {isLoading
                ? Array.from({ length: 24 }).map((_, i) => <SkeletonCard key={i} />)
                : manga.length === 0
                ? null
                : manga.map((m) => (
                    <Link key={m._id} href={`/manga/${m._id}`}>
                      <div className="group cursor-pointer">
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl group-hover:shadow-black/15 group-hover:scale-[1.03] transition-all duration-300">
                          <MangaCover manga={m} />
                          <div className="absolute top-2.5 left-2.5">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${statusColor(m.status)}`}>
                              {m.status}
                            </span>
                          </div>
                          {m.rating > 0 && (
                            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur px-1.5 py-0.5 rounded-full">
                              <span className="text-yellow-400 text-[10px]">★</span>
                              <span className="text-[10px] font-black text-white">{m.rating.toFixed(1)}</span>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent flex items-end px-2.5 pb-2">
                            <span className="text-[10px] font-bold text-white/70">{m.totalChapters} ch.</span>
                          </div>
                        </div>
                        <div className="mt-2.5 px-0.5">
                          <p className="text-[13px] font-black text-gray-900 leading-tight line-clamp-2 group-hover:text-orange-500 transition-colors">{m.title}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5 truncate">{m.author}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {m.genre.slice(0, 2).map(g => (
                              <span key={g} className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">{g}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
              }
            </div>

            {/* Empty state */}
            {!isLoading && manga.length === 0 && (
              <div className="text-center py-24">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-xl font-black text-gray-800 mb-2">No results found</p>
                <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                <button onClick={() => { setQuery(""); setActiveGenre("All"); setActiveStatus("All"); }}
                  className="mt-6 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-sm rounded-xl"
                >Clear Filters</button>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && !query && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-xl text-sm font-black border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-100 transition-all"
                >← Prev</button>
                <span className="px-4 py-2 text-sm font-black text-gray-800">
                  Page {page} of {totalPages}
                </span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl text-sm font-black border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-100 transition-all"
                >Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}