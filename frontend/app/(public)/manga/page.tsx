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

// ── Status color ──────────────────────────────────────────────────────────────
function statusStyle(status: string): React.CSSProperties {
  if (status === "Ongoing")   return { background: "rgba(34,197,94,0.15)",  color: "#4ade80",  border: "1px solid rgba(34,197,94,0.25)"  };
  if (status === "Completed") return { background: "rgba(59,130,246,0.15)", color: "#60a5fa",  border: "1px solid rgba(59,130,246,0.25)" };
  if (status === "Cancelled") return { background: "rgba(239,68,68,0.15)",  color: "#f87171",  border: "1px solid rgba(239,68,68,0.25)"  };
  return                             { background: "rgba(245,158,11,0.15)", color: "#fbbf24",  border: "1px solid rgba(245,158,11,0.25)" };
}

// ── Cover with fallback ───────────────────────────────────────────────────────
function MangaCover({ manga }: { manga: Manga }) {
  const [imgError, setImgError] = useState(false);
  const gradients = [
    "linear-gradient(145deg, #2a0a0a, #1a0a1a)",
    "linear-gradient(145deg, #0a1a2a, #0a0a2a)",
    "linear-gradient(145deg, #1a0a2e, #0d1a3a)",
    "linear-gradient(145deg, #0a2a1a, #0a1a0a)",
    "linear-gradient(145deg, #2a1a0a, #1a0a0a)",
    "linear-gradient(145deg, #1a1a0a, #2a0a1a)",
  ];
  const bg = gradients[manga.title.charCodeAt(0) % gradients.length];

  if (manga.coverImage && !imgError) {
    return <img src={manga.coverImage} alt={manga.title} onError={() => setImgError(true)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  }
  return (
    <div style={{ width: "100%", height: "100%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: "radial-gradient(circle, #FF6B35 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
      <span style={{ fontSize: "2.5rem", opacity: 0.12, userSelect: "none" }}>📕</span>
    </div>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div>
      <div style={{ aspectRatio: "3/4", borderRadius: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", animation: "pulse 2s ease-in-out infinite" }} />
      <div style={{ marginTop: "10px", height: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "6px", width: "75%" }} />
      <div style={{ marginTop: "5px", height: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", width: "50%" }} />
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
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

  const fetchManga = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await mangaService.getAll({ page, limit: 24, genre: activeGenre, status: activeStatus, sort: sortBy });
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

  useEffect(() => {
    if (!query.trim()) { fetchManga(); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await mangaService.search(query);
        setManga(res.data); setTotalPages(1); setTotal(res.data.length);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => { setPage(1); }, [activeGenre, activeStatus, sortBy]);

  const activeFilterCount = (activeGenre !== "All" ? 1 : 0) + (activeStatus !== "All" ? 1 : 0);
  const isLoading = loading || searching;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@400;500;700;900&family=Share+Tech+Mono&display=swap');

        @keyframes ink-float {
          0%   { opacity: 0; transform: translateY(0) scale(0.5) rotate(0deg); }
          15%  { opacity: 0.7; }
          85%  { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-600px) scale(1.5) rotate(180deg); }
        }
        .ink-float { animation: ink-float linear infinite; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        .spin-slow { animation: spin-slow 1s linear infinite; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both; }

        .manga-card { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); }
        .manga-card:hover { transform: translateY(-8px) scale(1.03); }
        .manga-card:hover .card-title { color: #FF6B35 !important; }
        .manga-card:hover .card-overlay { opacity: 1 !important; }

        .genre-pill { transition: all 0.2s; cursor: pointer; }
        .genre-pill:hover { border-color: rgba(255,107,53,0.4) !important; color: rgba(255,255,255,0.85) !important; }

        .status-pill { transition: all 0.2s; cursor: pointer; }
        .status-pill:hover { border-color: rgba(255,107,53,0.3) !important; color: rgba(255,255,255,0.7) !important; }

        .filter-bar-sticky {
          position: sticky;
          top: 0;
          z-index: 40;
          background: rgba(10,10,15,0.92);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        /* custom scrollbar for genre row */
        .genre-scroll::-webkit-scrollbar { height: 0px; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: rgba(255,107,53,0.35); border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Noto Sans JP', sans-serif", paddingBottom: "5rem" }}>

        {/* ── Fixed background ── */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-10%", left: "20%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.25) 0%, transparent 70%)", filter: "blur(90px)", opacity: 0.18 }} />
          <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,57,70,0.35) 0%, transparent 70%)", filter: "blur(80px)", opacity: 0.12 }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.028, backgroundImage: "radial-gradient(circle, #FF6B35 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)" }} />
          {/* Ink particles */}
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="ink-float" style={{
              position: "absolute", left: `${(i * 43 + 9) % 92}%`, bottom: "-10px",
              width: `${3 + (i % 5) * 2}px`, height: `${3 + (i % 5) * 2}px`,
              borderRadius: "50%",
              background: i % 2 === 0 ? "radial-gradient(circle, rgba(255,107,53,0.5), transparent)" : "radial-gradient(circle, rgba(230,57,70,0.4), transparent)",
              animationDelay: `${i * 0.9}s`, animationDuration: `${8 + (i % 4)}s`,
              filter: "blur(1.5px)",
            }} />
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 10 }}>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* HERO                                                        */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div style={{ position: "relative", borderBottom: "1px solid rgba(255,255,255,0.05)", overflow: "hidden", padding: "clamp(5rem,10vw,7rem) 1.5rem 2.5rem" }}>
            {/* Diagonal lines */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(-55deg, transparent, transparent 60px, rgba(255,107,53,1) 60px, rgba(255,107,53,1) 61px)", pointerEvents: "none" }} />
            {/* Ghost watermark */}
            <div style={{ position: "absolute", top: "-20px", right: "2%", fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(100px, 18vw, 260px)", color: "transparent", WebkitTextStroke: "1px rgba(255,107,53,0.05)", lineHeight: 1, userSelect: "none", pointerEvents: "none", letterSpacing: "0.02em" }}>
              BROWSE
            </div>

            <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }} className="fade-up">
              {/* Breadcrumb */}
              <nav style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.25rem" }}>
                <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontFamily: "'Share Tech Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#FF6B35"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.3)"}
                >Dashboard</Link>
                <span style={{ color: "rgba(255,107,53,0.4)", fontFamily: "'Share Tech Mono', monospace", fontSize: "11px" }}>›</span>
                <span style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Share Tech Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" }}>Browse</span>
              </nav>

              {/* Chapter tag */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.875rem" }}>
                <div style={{ width: "24px", height: "2px", background: "#FF6B35", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>
                  The Library — All Titles
                </span>
              </div>

              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 8vw, 6rem)", letterSpacing: "0.03em", lineHeight: 0.9, marginBottom: "0.75rem", background: "linear-gradient(135deg, #fff 0%, #FF6B35 55%, #E63946 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Browse Manga
              </h1>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.9rem", marginBottom: "2rem", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.05em" }}>
                {total > 0 ? `${total.toLocaleString()} titles in the library` : "Discover manga across every genre"}
              </p>

              {/* Search bar */}
              <div style={{ position: "relative", maxWidth: "560px" }}>
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,107,53,0.5)", pointerEvents: "none", display: "flex" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search by title or author…"
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: "14px",
                    padding: "14px 48px 14px 44px",
                    color: "#fff",
                    fontFamily: "'Noto Sans JP', sans-serif",
                    fontSize: "0.9375rem",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,107,53,0.45)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,107,53,0.08)"; }}
                  onBlur={e  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.boxShadow = "none"; }}
                />
                {(query || isLoading) && (
                  <button onClick={() => setQuery("")} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: "1.1rem", display: "flex", alignItems: "center" }}>
                    {isLoading ? <span className="spin-slow" style={{ fontSize: "1rem" }}>⟳</span> : "×"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* STICKY FILTER BAR                                          */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div className="filter-bar-sticky">
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 0", overflowX: "auto" }} className="genre-scroll">

                {/* Genre pills — desktop */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }} className="hidden md:flex">
                  {ALL_GENRES.map(g => (
                    <button key={g} onClick={() => setActiveGenre(g)} className="genre-pill" style={{
                      padding: "5px 12px", borderRadius: "9px", border: "1px solid",
                      fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase",
                      cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
                      background: activeGenre === g ? "linear-gradient(135deg, #FF6B35, #E63946)" : "rgba(255,255,255,0.03)",
                      borderColor: activeGenre === g ? "transparent" : "rgba(255,255,255,0.07)",
                      color: activeGenre === g ? "#fff" : "rgba(255,255,255,0.4)",
                      boxShadow: activeGenre === g ? "0 0 16px rgba(255,107,53,0.3)" : "none",
                    }}>
                      {g}
                    </button>
                  ))}
                </div>

                {/* Mobile filter toggle */}
                <button onClick={() => setShowFilters(v => !v)} className="md:hidden" style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "6px 12px", borderRadius: "10px",
                  border: `1px solid ${showFilters || activeFilterCount > 0 ? "rgba(255,107,53,0.4)" : "rgba(255,255,255,0.08)"}`,
                  background: showFilters || activeFilterCount > 0 ? "rgba(255,107,53,0.08)" : "transparent",
                  color: showFilters || activeFilterCount > 0 ? "#FF6B35" : "rgba(255,255,255,0.4)",
                  fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase",
                  cursor: "pointer",
                }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                  Filters
                  {activeFilterCount > 0 && (
                    <span style={{ width: "16px", height: "16px", background: "#FF6B35", color: "#fff", borderRadius: "50%", fontSize: "9px", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Divider + Status — desktop */}
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, borderLeft: "1px solid rgba(255,255,255,0.06)", paddingLeft: "12px" }} className="hidden md:flex">
                  {ALL_STATUSES.map(s => (
                    <button key={s} onClick={() => setActiveStatus(s)} className="status-pill" style={{
                      padding: "5px 12px", borderRadius: "9px", border: "1px solid",
                      fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase",
                      cursor: "pointer", whiteSpace: "nowrap",
                      background: activeStatus === s ? "rgba(255,255,255,0.08)" : "transparent",
                      borderColor: activeStatus === s ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
                      color: activeStatus === s ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
                    }}>
                      {s}
                    </button>
                  ))}
                </div>

                {/* Sort select */}
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
                  flexShrink: 0,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  padding: "5px 10px",
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "10px", letterSpacing: "0.1em",
                  outline: "none", cursor: "pointer",
                  marginLeft: "8px",
                }}>
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} style={{ background: "#0a0a0f" }}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Mobile filter panel */}
            {showFilters && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 1.5rem 16px", background: "rgba(10,10,15,0.97)" }} className="md:hidden">
                <div style={{ marginBottom: "12px" }}>
                  <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.5)", marginBottom: "8px" }}>Genre</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {ALL_GENRES.map(g => (
                      <button key={g} onClick={() => setActiveGenre(g)} style={{
                        padding: "5px 12px", borderRadius: "8px",
                        border: `1px solid ${activeGenre === g ? "transparent" : "rgba(255,255,255,0.08)"}`,
                        background: activeGenre === g ? "linear-gradient(135deg, #FF6B35, #E63946)" : "rgba(255,255,255,0.03)",
                        color: activeGenre === g ? "#fff" : "rgba(255,255,255,0.4)",
                        fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase",
                        cursor: "pointer",
                      }}>{g}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.5)", marginBottom: "8px" }}>Status</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {ALL_STATUSES.map(s => (
                      <button key={s} onClick={() => setActiveStatus(s)} style={{
                        padding: "5px 12px", borderRadius: "8px",
                        border: `1px solid ${activeStatus === s ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)"}`,
                        background: activeStatus === s ? "rgba(255,255,255,0.08)" : "transparent",
                        color: activeStatus === s ? "#fff" : "rgba(255,255,255,0.35)",
                        fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase",
                        cursor: "pointer",
                      }}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* RESULTS                                                     */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>

            {/* Results meta row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }}>
                {isLoading ? "Loading…" : <><span style={{ color: "#FF6B35", fontWeight: 900 }}>{total.toLocaleString()}</span> titles</>}
                {query && <span style={{ color: "rgba(255,107,53,0.7)" }}> for "{query}"</span>}
              </p>
              {(query || activeGenre !== "All" || activeStatus !== "All") && (
                <button onClick={() => { setQuery(""); setActiveGenre("All"); setActiveStatus("All"); }} style={{
                  fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "#E63946", background: "transparent", border: "1px solid rgba(230,57,70,0.2)", borderRadius: "8px",
                  padding: "4px 12px", cursor: "pointer", transition: "all 0.2s",
                }}>
                  Clear All ×
                </button>
              )}
            </div>

            {/* Error */}
            {error ? (
              <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
                <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.75rem", letterSpacing: "0.05em", color: "#fff", marginBottom: "0.5rem" }}>Failed to Load Manga</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>{error}</p>
                <button onClick={fetchManga} style={{
                  padding: "10px 28px", background: "linear-gradient(135deg, #FF6B35, #E63946)",
                  border: "none", borderRadius: "12px", color: "#fff",
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em",
                  cursor: "pointer", boxShadow: "0 0 20px rgba(255,107,53,0.3)",
                }}>Try Again</button>
              </div>
            ) : (
              <>
                {/* Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1.25rem" }}>
                  {isLoading
                    ? Array.from({ length: 24 }).map((_, i) => <SkeletonCard key={i} />)
                    : manga.map(m => (
                      <Link key={m._id} href={`/manga/${m._id}`} style={{ textDecoration: "none" }}>
                        <div className="manga-card" style={{ cursor: "pointer" }}>
                          {/* Cover */}
                          <div style={{ position: "relative", aspectRatio: "3/4", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <MangaCover manga={m} />

                            {/* Hover overlay */}
                            <div className="card-overlay" style={{ position: "absolute", inset: 0, background: "rgba(255,107,53,0.06)", opacity: 0, transition: "opacity 0.3s" }} />

                            {/* Status badge */}
                            <div style={{ position: "absolute", top: "8px", left: "8px" }}>
                              <span style={{ ...statusStyle(m.status), fontSize: "9px", fontWeight: 900, padding: "2px 7px", borderRadius: "20px", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                {m.status}
                              </span>
                            </div>

                            {/* Rating badge */}
                            {m.rating > 0 && (
                              <div style={{ position: "absolute", top: "8px", right: "8px", display: "flex", alignItems: "center", gap: "3px", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", padding: "2px 6px", borderRadius: "20px", border: "1px solid rgba(255,200,0,0.2)" }}>
                                <span style={{ color: "#F4D03F", fontSize: "9px" }}>★</span>
                                <span style={{ color: "#fff", fontSize: "9px", fontWeight: 900, fontFamily: "'Share Tech Mono', monospace" }}>{m.rating.toFixed(1)}</span>
                              </div>
                            )}

                            {/* Bottom chapter count */}
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "48px", background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)", display: "flex", alignItems: "flex-end", padding: "0 8px 6px" }}>
                              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "10px", fontFamily: "'Share Tech Mono', monospace" }}>{m.totalChapters} ch.</span>
                            </div>
                          </div>

                          {/* Info */}
                          <div style={{ marginTop: "10px" }}>
                            <p className="card-title" style={{ fontSize: "12px", fontWeight: 900, color: "rgba(255,255,255,0.85)", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontFamily: "'Noto Sans JP', sans-serif", transition: "color 0.2s" }}>
                              {m.title}
                            </p>
                            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.28)", marginTop: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Share Tech Mono', monospace" }}>
                              {m.author}
                            </p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
                              {m.genre.slice(0, 2).map(g => (
                                <span key={g} style={{ fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", padding: "2px 6px", borderRadius: "6px", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                                  {g}
                                </span>
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
                  <div style={{ textAlign: "center", padding: "6rem 2rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle, #FF6B35 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                    <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</p>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.75rem", letterSpacing: "0.05em", color: "#fff", marginBottom: "0.5rem" }}>No Results Found</p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Try adjusting your search or filters</p>
                    <button onClick={() => { setQuery(""); setActiveGenre("All"); setActiveStatus("All"); }} style={{
                      padding: "10px 28px", background: "linear-gradient(135deg, #FF6B35, #E63946)",
                      border: "none", borderRadius: "12px", color: "#fff",
                      fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em",
                      cursor: "pointer", boxShadow: "0 0 20px rgba(255,107,53,0.3)",
                    }}>Clear Filters</button>
                  </div>
                )}

                {/* Pagination */}
                {!isLoading && !query && totalPages > 1 && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "3rem" }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{
                      padding: "9px 20px", borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.03)",
                      color: page === 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)",
                      fontFamily: "'Share Tech Mono', monospace", fontSize: "11px", letterSpacing: "0.12em",
                      cursor: page === 1 ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                    }}>← Prev</button>

                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      {/* Show page numbers */}
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                        return (
                          <button key={p} onClick={() => setPage(p)} style={{
                            width: "36px", height: "36px", borderRadius: "10px",
                            border: `1px solid ${p === page ? "rgba(255,107,53,0.4)" : "rgba(255,255,255,0.07)"}`,
                            background: p === page ? "linear-gradient(135deg, #FF6B35, #E63946)" : "rgba(255,255,255,0.03)",
                            color: p === page ? "#fff" : "rgba(255,255,255,0.4)",
                            fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.05em",
                            cursor: "pointer",
                            boxShadow: p === page ? "0 0 14px rgba(255,107,53,0.3)" : "none",
                          }}>{p}</button>
                        );
                      })}
                    </div>

                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{
                      padding: "9px 20px", borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.03)",
                      color: page === totalPages ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)",
                      fontFamily: "'Share Tech Mono', monospace", fontSize: "11px", letterSpacing: "0.12em",
                      cursor: page === totalPages ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                    }}>Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}