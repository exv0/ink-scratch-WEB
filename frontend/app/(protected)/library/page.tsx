// frontend/app/(protected)/library/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { libraryService, LibraryManga } from "@/lib/services/library.service";

function CoverImage({ manga }: { manga: LibraryManga }) {
  const [imgError, setImgError] = useState(false);
  const gradients = [
    "linear-gradient(145deg, #2a0a0a, #1a0a1a)",
    "linear-gradient(145deg, #0a1a2a, #0a0a2a)",
    "linear-gradient(145deg, #1a0a2e, #0d1a3a)",
    "linear-gradient(145deg, #0a2a1a, #0a1a0a)",
    "linear-gradient(145deg, #2a1a0a, #1a0a0a)",
  ];
  const bg = gradients[manga.title.charCodeAt(0) % gradients.length];
  if (manga.coverImage && !imgError) {
    return <img src={manga.coverImage} alt={manga.title} onError={() => setImgError(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  }
  return (
    <div style={{ width: "100%", height: "100%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: "radial-gradient(circle, #FF6B35 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
      <span style={{ fontSize: "2rem", opacity: 0.12, userSelect: "none" }}>📕</span>
    </div>
  );
}

function statusStyle(status: string): React.CSSProperties {
  if (status === "Ongoing")   return { background: "rgba(34,197,94,0.15)",  color: "#4ade80",  border: "1px solid rgba(34,197,94,0.3)"  };
  if (status === "Completed") return { background: "rgba(59,130,246,0.15)", color: "#60a5fa",  border: "1px solid rgba(59,130,246,0.3)" };
  if (status === "Cancelled") return { background: "rgba(239,68,68,0.15)",  color: "#f87171",  border: "1px solid rgba(239,68,68,0.3)"  };
  return                             { background: "rgba(245,158,11,0.15)", color: "#fbbf24",  border: "1px solid rgba(245,158,11,0.3)" };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

type SortKey      = "addedAt" | "title" | "rating";
type FilterStatus = "All" | "Ongoing" | "Completed" | "Cancelled";

export default function LibraryPage() {
  const [library,       setLibrary]       = useState<LibraryManga[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [sort,          setSort]          = useState<SortKey>("addedAt");
  const [filterStatus,  setFilterStatus]  = useState<FilterStatus>("All");
  const [removeConfirm, setRemoveConfirm] = useState<string | null>(null);
  const [removing,      setRemoving]      = useState<string | null>(null);
  const [viewMode,      setViewMode]      = useState<"grid" | "list">("grid");

  useEffect(() => {
    libraryService.getAll().then((data) => {
      setLibrary(data);
      setLoading(false);
    });
  }, []);

  const handleRemove = async (mangaId: string) => {
    setRemoving(mangaId);
    await libraryService.remove(mangaId);
    setLibrary(prev => prev.filter(m => m._id !== mangaId && m.mangaId !== mangaId));
    setRemoveConfirm(null);
    setRemoving(null);
  };

  const filtered = library
    .filter((m) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || m.title.toLowerCase().includes(q) || m.author.toLowerCase().includes(q);
      const matchesStatus = filterStatus === "All" || m.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sort === "addedAt") return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      if (sort === "title")   return a.title.localeCompare(b.title);
      if (sort === "rating")  return b.rating - a.rating;
      return 0;
    });

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid rgba(255,107,53,0.2)", borderTop: "3px solid #FF6B35", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading library…</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@300;400;500;700;900&family=Share+Tech+Mono&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ink-float { 0% { opacity: 0; transform: translateY(0) scale(0.5) rotate(0deg); } 15% { opacity: 0.7; } 85% { opacity: 0.3; } 100% { opacity: 0; transform: translateY(-600px) scale(1.5) rotate(180deg); } }
        .ink-float { animation: ink-float linear infinite; }
        @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .manga-card { position: relative; background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; overflow: hidden; transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s; cursor: pointer; }
        .manga-card:hover { border-color: rgba(255,107,53,0.3); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 20px rgba(255,107,53,0.08); }
        .manga-card:hover .card-title { color: #FF6B35; }
        .manga-card:hover .remove-btn { opacity: 1 !important; }
        .list-row { display: flex; align-items: center; gap: 16px; padding: 14px 18px; background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; transition: border-color 0.2s, background 0.2s, transform 0.2s; }
        .list-row:hover { border-color: rgba(255,107,53,0.3); background: rgba(255,107,53,0.03); transform: translateX(4px); }
        .list-row:hover .list-title { color: #FF6B35; }
        .ctrl-input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: rgba(255,255,255,0.8); font-family: 'Noto Sans JP', sans-serif; font-size: 0.875rem; padding: 10px 14px; outline: none; transition: border-color 0.2s; }
        .ctrl-input::placeholder { color: rgba(255,255,255,0.2); }
        .ctrl-input:focus { border-color: rgba(255,107,53,0.4); background: rgba(255,107,53,0.03); }
        .ctrl-select { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: rgba(255,255,255,0.7); font-family: 'Share Tech Mono', monospace; font-size: 11px; letter-spacing: 0.06em; padding: 10px 14px; outline: none; cursor: pointer; transition: border-color 0.2s; }
        .ctrl-select:focus { border-color: rgba(255,107,53,0.4); }
        .ctrl-select option { background: #16161f; }
        .view-btn { width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); cursor: pointer; font-size: 14px; transition: all 0.2s; color: rgba(255,255,255,0.4); }
        .view-btn:hover { border-color: rgba(255,107,53,0.35); color: #FF6B35; }
        .view-btn-active { background: rgba(255,107,53,0.12) !important; border-color: rgba(255,107,53,0.4) !important; color: #FF6B35 !important; }
        .remove-btn-list { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; color: rgba(239,68,68,0.6); font-family: 'Share Tech Mono', monospace; font-size: 10px; letter-spacing: 0.08em; padding: 6px 12px; cursor: pointer; transition: all 0.2s; white-space: nowrap; flex-shrink: 0; }
        .remove-btn-list:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.4); color: #f87171; }
        .filter-pill { padding: 5px 14px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.4); font-family: 'Share Tech Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .filter-pill:hover { border-color: rgba(255,107,53,0.3); color: rgba(255,255,255,0.7); }
        .filter-pill-active { background: rgba(255,107,53,0.12) !important; border-color: rgba(255,107,53,0.4) !important; color: #FF6B35 !important; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: rgba(255,107,53,0.35); border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Noto Sans JP', sans-serif", paddingBottom: "5rem" }}>
        {/* Background */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-10%", left: "20%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.25) 0%, transparent 70%)", filter: "blur(90px)", opacity: 0.15 }} />
          <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(230,57,70,0.3) 0%, transparent 70%)", filter: "blur(80px)", opacity: 0.1 }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "radial-gradient(circle, #FF6B35 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="ink-float" style={{ position: "absolute", left: `${(i * 53 + 7) % 92}%`, bottom: -10, width: 3 + (i % 4) * 2, height: 3 + (i % 4) * 2, borderRadius: "50%", background: i % 2 === 0 ? "radial-gradient(circle, rgba(255,107,53,0.5), transparent)" : "radial-gradient(circle, rgba(230,57,70,0.4), transparent)", animationDelay: `${i * 1.1}s`, animationDuration: `${8 + (i % 4)}s`, filter: "blur(1.5px)" }} />
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 10 }}>
          {/* Hero */}
          <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,10,10,0.85) 0%, rgba(13,0,20,0.85) 50%, rgba(10,10,26,0.85) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(-55deg, transparent, transparent 60px, rgba(255,107,53,1) 60px, rgba(255,107,53,1) 61px)" }} />

            <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "clamp(5rem,10vw,7rem) 1.5rem 0" }}>
              <nav className="fade-up" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.5rem" }}>
                <div style={{ width: 20, height: 2, background: "#FF6B35", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>My Library</span>
                <span style={{ color: "rgba(255,107,53,0.35)", fontSize: 10 }}>›</span>
                <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#FF6B35"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.3)"}
                >Dashboard</Link>
              </nav>

              <div className="fade-up" style={{ animationDelay: "0.1s", paddingBottom: "2rem" }}>
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem,7vw,5rem)", letterSpacing: "0.03em", lineHeight: 0.9, marginBottom: "0.5rem", background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>My Library</h1>
                <p style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: "0.12em" }}>
                  {library.length} {library.length === 1 ? "series" : "series"} saved · your personal reading list
                </p>
              </div>
            </div>

            {/* Stats bar */}
            <div style={{ position: "relative", borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)" }}>
              <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "repeat(4, auto)", width: "fit-content" }}>
                {[
                  { label: "Total",      value: library.length },
                  { label: "Ongoing",    value: library.filter(m => m.status === "Ongoing").length },
                  { label: "Completed",  value: library.filter(m => m.status === "Completed").length },
                  { label: "Avg Rating", value: library.length ? (library.reduce((s, m) => s + m.rating, 0) / library.length).toFixed(1) : "—" },
                ].map((s, i) => (
                  <div key={s.label} style={{ textAlign: "center", padding: "14px 28px", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.04em", color: "#fff", lineHeight: 1 }}>{s.value}</p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 3 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "1.5rem 1.5rem 0" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", padding: "14px 16px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 }}>
              <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>🔍</span>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your library…" className="ctrl-input" style={{ width: "100%", paddingLeft: 34, boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(["All", "Ongoing", "Completed", "Cancelled"] as FilterStatus[]).map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)} className={`filter-pill${filterStatus === s ? " filter-pill-active" : ""}`}>{s}</button>
                ))}
              </div>
              <select value={sort} onChange={e => setSort(e.target.value as SortKey)} className="ctrl-select">
                <option value="addedAt">Recently Added</option>
                <option value="title">Title A–Z</option>
                <option value="rating">Highest Rated</option>
              </select>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => setViewMode("grid")} className={`view-btn${viewMode === "grid" ? " view-btn-active" : ""}`} title="Grid view">⊞</button>
                <button onClick={() => setViewMode("list")} className={`view-btn${viewMode === "list" ? " view-btn-active" : ""}`} title="List view">☰</button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ maxWidth: 1280, margin: "1.25rem auto 0", padding: "0 1.5rem" }}>
            {library.length === 0 && (
              <div style={{ textAlign: "center", padding: "6rem 2rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24 }}>
                <p style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📚</p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.05em", color: "#fff", marginBottom: "0.5rem" }}>Your Library is Empty</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.875rem", marginBottom: "1.75rem", maxWidth: 360, margin: "0 auto 1.75rem" }}>
                  Browse manga and hit <span style={{ color: "#FF6B35" }}>+ Add to Library</span> on any title to save it here.
                </p>
                <Link href="/manga" style={{ textDecoration: "none" }}>
                  <button style={{ padding: "12px 28px", background: "linear-gradient(135deg, #FF6B35, #E63946)", border: "none", borderRadius: 14, color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.1em", cursor: "pointer", boxShadow: "0 0 20px rgba(255,107,53,0.3)" }}>Browse Manga</button>
                </Link>
              </div>
            )}

            {library.length > 0 && filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "4rem 2rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24 }}>
                <p style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.05em", color: "#fff", marginBottom: "0.5rem" }}>No Results</p>
                <button onClick={() => { setSearch(""); setFilterStatus("All"); }} style={{ marginTop: 12, background: "none", border: "none", color: "#FF6B35", fontFamily: "'Share Tech Mono', monospace", fontSize: 12, letterSpacing: "0.1em", cursor: "pointer", textDecoration: "underline" }}>Clear Filters</button>
              </div>
            )}

            {/* Grid view */}
            {filtered.length > 0 && viewMode === "grid" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
                {filtered.map((manga, i) => (
                  <div key={manga._id} className="manga-card" style={{ animationDelay: `${i * 0.04}s` }}>
                    <Link href={`/manga/${manga.mangaId}`} style={{ textDecoration: "none", display: "block" }}>
                      <div style={{ aspectRatio: "3/4", overflow: "hidden", position: "relative" }}>
                        <CoverImage manga={manga} />
                        <button className="remove-btn" onClick={e => { e.preventDefault(); e.stopPropagation(); setRemoveConfirm(manga.mangaId); }}
                          style={{ position: "absolute", top: 8, right: 8, opacity: 0, width: 30, height: 30, borderRadius: 8, background: "rgba(239,68,68,0.85)", backdropFilter: "blur(4px)", border: "none", color: "#fff", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 0.2s", zIndex: 2 }}
                          title="Remove from library"
                        >✕</button>
                        <div style={{ position: "absolute", bottom: 8, left: 8 }}>
                          <span style={{ ...statusStyle(manga.status), fontFamily: "'Share Tech Mono', monospace", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 10 }}>{manga.status}</span>
                        </div>
                      </div>
                      <div style={{ padding: "12px 12px 14px" }}>
                        <p className="card-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.04em", color: "rgba(255,255,255,0.9)", lineHeight: 1.15, marginBottom: 4, transition: "color 0.2s", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{manga.title}</p>
                        <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", marginBottom: 6 }}>{manga.author}</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          {manga.rating > 0 && <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", color: "#F4D03F", letterSpacing: "0.04em" }}>★ {manga.rating.toFixed(1)}</span>}
                          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.2)", letterSpacing: "0.04em", marginLeft: "auto" }}>{timeAgo(manga.addedAt)}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* List view */}
            {filtered.length > 0 && viewMode === "list" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.map((manga) => (
                  <div key={manga._id} className="list-row">
                    <Link href={`/manga/${manga.mangaId}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                      <div style={{ width: 48, height: 64, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,107,53,0.15)" }}><CoverImage manga={manga} /></div>
                    </Link>
                    <Link href={`/manga/${manga.mangaId}`} style={{ textDecoration: "none", flex: 1, minWidth: 0 }}>
                      <p className="list-title" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.04em", color: "rgba(255,255,255,0.9)", lineHeight: 1.15, marginBottom: 3, transition: "color 0.2s", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{manga.title}</p>
                      <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", marginBottom: 6 }}>by {manga.author}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ ...statusStyle(manga.status), fontFamily: "'Share Tech Mono', monospace", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 10 }}>{manga.status}</span>
                        {manga.genre.slice(0, 2).map(g => (
                          <span key={g} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 8, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 10, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>{g}</span>
                        ))}
                      </div>
                    </Link>
                    <div style={{ flexShrink: 0, textAlign: "right", minWidth: 70 }}>
                      <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>{timeAgo(manga.addedAt)}</p>
                    </div>
                    <button className="remove-btn-list" onClick={() => setRemoveConfirm(manga.mangaId)}>✕ Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Remove confirmation modal */}
      {removeConfirm && (() => {
        const m = library.find(x => x.mangaId === removeConfirm || x._id === removeConfirm);
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
            <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "2rem", maxWidth: 380, width: "100%", boxShadow: "0 0 60px rgba(0,0,0,0.8)" }}>
              {m && (
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "1.5rem", padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14 }}>
                  <div style={{ width: 44, height: 58, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,107,53,0.15)" }}><CoverImage manga={m} /></div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.04em", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.title}</p>
                    <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>{m.author}</p>
                  </div>
                </div>
              )}
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div style={{ width: 52, height: 52, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.875rem", fontSize: "1.5rem" }}>🗑️</div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.75rem", letterSpacing: "0.05em", color: "#fff", marginBottom: "0.375rem" }}>Remove from Library?</h3>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem", lineHeight: 1.6 }}>You can always re-add it later from the manga page.</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => handleRemove(removeConfirm)} disabled={!!removing}
                  style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #ef4444, #dc2626)", border: "none", borderRadius: 12, color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em", cursor: removing ? "wait" : "pointer", opacity: removing ? 0.7 : 1 }}>
                  {removing ? "Removing…" : "Remove"}
                </button>
                <button onClick={() => setRemoveConfirm(null)} style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.6)", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em", cursor: "pointer" }}>Keep It</button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}