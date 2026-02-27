// frontend/app/(public)/manga/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { mangaService, Manga, Chapter } from "@/lib/services/manga.service";
import { libraryService } from "@/lib/services/library.service";

type Tab = "chapters" | "about";

function statusStyle(status: string): React.CSSProperties {
  if (status === "Ongoing")   return { background: "rgba(34,197,94,0.15)",  color: "#4ade80",  border: "1px solid rgba(34,197,94,0.3)"  };
  if (status === "Completed") return { background: "rgba(59,130,246,0.15)", color: "#60a5fa",  border: "1px solid rgba(59,130,246,0.3)" };
  if (status === "Cancelled") return { background: "rgba(239,68,68,0.15)",  color: "#f87171",  border: "1px solid rgba(239,68,68,0.3)"  };
  return                             { background: "rgba(245,158,11,0.15)", color: "#fbbf24",  border: "1px solid rgba(245,158,11,0.3)" };
}

function CoverImage({ manga, size = "large" }: { manga: Manga; size?: "large" | "small" }) {
  const [imgError, setImgError] = useState(false);
  const gradients = [
    "linear-gradient(145deg, #2a0a0a, #1a0a1a)",
    "linear-gradient(145deg, #0a1a2a, #0a0a2a)",
    "linear-gradient(145deg, #1a0a2e, #0d1a3a)",
    "linear-gradient(145deg, #0a2a1a, #0a1a0a)",
    "linear-gradient(145deg, #2a1a0a, #1a0a0a)",
  ];
  const bg = gradients[manga.title.charCodeAt(0) % gradients.length];
  const coverSrc = manga.coverImage || (manga as any).cover_image || (manga as any).cover || (manga as any).thumbnail;

  if (coverSrc && !imgError) {
    return (
      <img src={coverSrc} alt={manga.title} onError={() => setImgError(true)}
        referrerPolicy="no-referrer" crossOrigin="anonymous"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    );
  }
  return (
    <div style={{ width: "100%", height: "100%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: "radial-gradient(circle, #FF6B35 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <span style={{ fontSize: size === "large" ? "4rem" : "2rem", opacity: 0.25, display: "block", marginBottom: "8px" }}>📕</span>
        {size === "large" && <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>No Cover</span>}
      </div>
    </div>
  );
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

export default function MangaDetailPage() {
  const params = useParams();
  const id     = params.id as string;

  const [manga,        setManga]        = useState<Manga | null>(null);
  const [chapters,     setChapters]     = useState<Chapter[]>([]);
  const [tab,          setTab]          = useState<Tab>("chapters");
  const [inLibrary,    setInLibrary]    = useState(false);
  const [libLoading,   setLibLoading]   = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true); setError(null);
      try {
        const [mangaRes, chaptersRes] = await Promise.all([
          mangaService.getById(id),
          mangaService.getChapters(id),
        ]);
        setManga(mangaRes.data);
        setChapters(chaptersRes.data);
        // Check library status async (non-blocking)
        libraryService.isInLibrary(id).then(setInLibrary);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleLibraryToggle = async () => {
    if (!manga || libLoading) return;
    setLibLoading(true);
    try {
      const nowIn = await libraryService.toggle({
        _id:         manga._id,
        mangaId:     manga._id,
        title:       manga.title,
        author:      manga.author,
        coverImage:  manga.coverImage,
        status:      manga.status,
        genre:       manga.genre,
        rating:      manga.rating,
        year:        manga.year,
        description: manga.description,
      });
      setInLibrary(nowIn);
    } finally {
      setLibLoading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", margin: "0 auto 16px", border: "3px solid rgba(255,107,53,0.2)", borderTop: "3px solid #FF6B35", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading…</p>
      </div>
    </div>
  );

  if (error || !manga) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</p>
        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.05em", color: "#fff", marginBottom: "0.5rem" }}>Failed to Load</p>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>{error}</p>
        <Link href="/manga"><button style={{ padding: "10px 28px", background: "linear-gradient(135deg, #FF6B35, #E63946)", border: "none", borderRadius: "12px", color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em", cursor: "pointer" }}>Back to Browse</button></Link>
      </div>
    </div>
  );

  const latestChapter    = chapters[chapters.length - 1];
  const firstChapter     = chapters[0];
  const reversedChapters = [...chapters].reverse();
  const coverSrc = manga.coverImage || (manga as any).cover_image || (manga as any).cover || (manga as any).thumbnail;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@300;400;500;700;900&family=Share+Tech+Mono&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ink-float {
          0%   { opacity: 0; transform: translateY(0) scale(0.5) rotate(0deg); }
          15%  { opacity: 0.7; } 85% { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-600px) scale(1.5) rotate(180deg); }
        }
        .ink-float { animation: ink-float linear infinite; }
        @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fade-up 0.75s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes cover-reveal { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .cover-reveal { animation: cover-reveal 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .chapter-row { transition: all 0.25s ease; border: 1px solid rgba(255,255,255,0.06); }
        .chapter-row:hover { border-color: rgba(255,107,53,0.3) !important; background: rgba(255,107,53,0.04) !important; transform: translateX(4px); }
        .chapter-row:hover .ch-arrow { color: #FF6B35 !important; }
        .chapter-row:hover .ch-title { color: #FF6B35 !important; }
        .tab-btn { transition: all 0.2s; cursor: pointer; }
        .lib-btn { transition: all 0.25s; }
        .lib-btn:hover { transform: translateY(-1px); }
        .action-btn { transition: all 0.25s; }
        .action-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .genre-badge { display: inline-block; font-size: 9px; font-weight: 900; padding: 3px 10px; border-radius: 20px; font-family: 'Share Tech Mono', monospace; letter-spacing: 0.1em; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.08); text-decoration: none; transition: all 0.2s ease; backdrop-filter: blur(4px); }
        .genre-badge:hover { background: rgba(255,107,53,0.15); border-color: rgba(255,107,53,0.4); color: #FF6B35; transform: translateY(-1px); }
        .cover-shadow { box-shadow: 0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,107,53,0.15), 0 0 40px rgba(255,107,53,0.08); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: rgba(255,107,53,0.35); border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Noto Sans JP', sans-serif", paddingBottom: "5rem" }}>
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-10%", left: "20%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.25) 0%, transparent 70%)", filter: "blur(90px)", opacity: 0.18 }} />
          <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,57,70,0.35) 0%, transparent 70%)", filter: "blur(80px)", opacity: 0.12 }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.028, backgroundImage: "radial-gradient(circle, #FF6B35 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="ink-float" style={{ position: "absolute", left: `${(i * 53 + 7) % 92}%`, bottom: "-10px", width: `${3 + (i % 4) * 2}px`, height: `${3 + (i % 4) * 2}px`, borderRadius: "50%", background: i % 2 === 0 ? "radial-gradient(circle, rgba(255,107,53,0.5), transparent)" : "radial-gradient(circle, rgba(230,57,70,0.4), transparent)", animationDelay: `${i * 1.1}s`, animationDuration: `${8 + (i % 4)}s`, filter: "blur(1.5px)" }} />
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 10 }}>
          {/* HERO */}
          <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {coverSrc && (
              <div style={{ position: "absolute", inset: 0 }}>
                <img src={coverSrc} alt="" referrerPolicy="no-referrer" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px)", transform: "scale(1.15)", opacity: 0.18 }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,15,0.55) 0%, rgba(10,10,15,0.92) 70%, #0a0a0f 100%)" }} />
              </div>
            )}
            {!coverSrc && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,15,0.8), #0a0a0f)" }} />}
            <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "repeating-linear-gradient(-55deg, transparent, transparent 60px, rgba(255,107,53,1) 60px, rgba(255,107,53,1) 61px)" }} />

            <div style={{ position: "relative", maxWidth: "1100px", margin: "0 auto", padding: "clamp(5rem,10vw,7rem) 1.5rem 0" }}>
              {/* Breadcrumb */}
              <nav style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2rem" }} className="fade-up">
                {[{ href: "/dashboard", label: "Dashboard" }, { href: "/manga", label: "Browse" }].map((item) => (
                  <span key={item.href} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Link href={item.href} style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#FF6B35"}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.3)"}
                    >{item.label}</Link>
                    <span style={{ color: "rgba(255,107,53,0.35)", fontFamily: "'Share Tech Mono', monospace", fontSize: "10px" }}>›</span>
                  </span>
                ))}
                <span style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.1em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "220px" }}>{manga.title.toUpperCase()}</span>
              </nav>

              {/* Cover + Info */}
              <div style={{ display: "flex", gap: "clamp(1.5rem, 4vw, 3rem)", alignItems: "flex-end", paddingBottom: "2.5rem" }}>
                <div className="cover-reveal" style={{ flexShrink: 0 }}>
                  <div className="cover-shadow" style={{ width: "clamp(160px, 18vw, 240px)", aspectRatio: "2/3", borderRadius: "18px", overflow: "hidden", border: "2px solid rgba(255,107,53,0.2)", background: "#111" }}>
                    <CoverImage manga={manga} size="large" />
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0, paddingBottom: "4px" }} className="fade-up">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
                    <div style={{ width: "20px", height: "2px", background: "#FF6B35" }} />
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>Manga Detail</span>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "0.875rem" }}>
                    {manga.genre.slice(0, 5).map(g => (
                      <Link key={g} href={`/browse?genre=${encodeURIComponent(g)}`} className="genre-badge">{g}</Link>
                    ))}
                    <span style={{ ...statusStyle(manga.status), fontSize: "9px", fontWeight: 900, padding: "3px 10px", borderRadius: "20px", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>{manga.status}</span>
                  </div>

                  <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 6vw, 4.5rem)", letterSpacing: "0.03em", lineHeight: 0.9, marginBottom: "0.5rem", background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{manga.title}</h1>

                  <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <div>
                      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,107,53,0.5)", display: "block", marginBottom: "2px" }}>Author</span>
                      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem", fontWeight: 500 }}>{manga.author || "Unknown"}</span>
                    </div>
                    {manga.artist && manga.artist !== manga.author && (
                      <div>
                        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,107,53,0.5)", display: "block", marginBottom: "2px" }}>Artist</span>
                        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem", fontWeight: 500 }}>{manga.artist}</span>
                      </div>
                    )}
                    {manga.year && (
                      <div>
                        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,107,53,0.5)", display: "block", marginBottom: "2px" }}>Year</span>
                        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem", fontWeight: 500 }}>{manga.year}</span>
                      </div>
                    )}
                  </div>

                  {manga.rating > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "1.25rem" }}>
                      {[1,2,3,4,5].map(star => (<span key={star} style={{ color: manga.rating / 2 >= star ? "#F4D03F" : "rgba(255,255,255,0.15)", fontSize: "15px" }}>★</span>))}
                      <span style={{ color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.35rem", letterSpacing: "0.05em", marginLeft: "4px" }}>{manga.rating.toFixed(1)}</span>
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", fontFamily: "'Share Tech Mono', monospace" }}>/ 10</span>
                    </div>
                  )}

                  {manga.description && (
                    <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.8125rem", lineHeight: 1.7, marginBottom: "1.5rem", fontWeight: 300, maxWidth: "580px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{manga.description}</p>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {firstChapter && (
                      <Link href={`/manga/${id}/read/${firstChapter._id}`} style={{ textDecoration: "none" }}>
                        <button className="action-btn" style={{ padding: "11px 24px", background: "#fff", color: "#0a0a0f", border: "none", borderRadius: "12px", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                          📖 Start Reading
                        </button>
                      </Link>
                    )}
                    {latestChapter && latestChapter._id !== firstChapter?._id && (
                      <Link href={`/manga/${id}/read/${latestChapter._id}`} style={{ textDecoration: "none" }}>
                        <button className="action-btn" style={{ padding: "11px 24px", background: "linear-gradient(135deg, #FF6B35, #E63946)", color: "#fff", border: "none", borderRadius: "12px", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em", cursor: "pointer", boxShadow: "0 0 24px rgba(255,107,53,0.35)", display: "flex", alignItems: "center", gap: "6px" }}>
                          ⚡ Latest Chapter
                        </button>
                      </Link>
                    )}
                    <button
                      className="lib-btn"
                      onClick={handleLibraryToggle}
                      disabled={libLoading}
                      style={{
                        padding: "11px 24px",
                        background: inLibrary ? "rgba(255,107,53,0.12)" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${inLibrary ? "rgba(255,107,53,0.4)" : "rgba(255,255,255,0.12)"}`,
                        borderRadius: "12px", color: inLibrary ? "#FF6B35" : "rgba(255,255,255,0.6)",
                        fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em",
                        cursor: libLoading ? "wait" : "pointer",
                        opacity: libLoading ? 0.7 : 1,
                      }}
                    >
                      {libLoading ? "…" : inLibrary ? "✓ In Library" : "+ Add to Library"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div style={{ position: "relative", borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(10px)" }}>
              <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
                {[
                  { label: "Chapters", value: chapters.length.toLocaleString() },
                  { label: "Status",   value: manga.status },
                  { label: "Rating",   value: manga.rating > 0 ? `${manga.rating.toFixed(1)}/10` : "N/A" },
                  { label: "Year",     value: manga.year ?? "N/A" },
                ].map((s, i) => (
                  <div key={s.label} style={{ textAlign: "center", padding: "14px 8px", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.375rem", letterSpacing: "0.04em", color: "#fff", lineHeight: 1 }}>{s.value}</p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "3px" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TABS */}
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
            <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginTop: "1.75rem" }}>
              {(["chapters", "about"] as Tab[]).map(t => (
                <button key={t} className="tab-btn" onClick={() => setTab(t)} style={{ padding: "10px 20px", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em", background: "transparent", border: "none", borderBottom: `2px solid ${tab === t ? "#FF6B35" : "transparent"}`, marginBottom: "-1px", color: tab === t ? "#FF6B35" : "rgba(255,255,255,0.35)", textTransform: "capitalize" }}>
                  {t}{t === "chapters" && ` (${chapters.length})`}
                </button>
              ))}
            </div>

            {/* Chapters */}
            {tab === "chapters" && (
              <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "6px" }}>
                {chapters.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "5rem 2rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "18px" }}>
                    <p style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📂</p>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.05em", color: "#fff", marginBottom: "0.375rem" }}>No Chapters Yet</p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.875rem" }}>Chapters are being imported in the background</p>
                  </div>
                ) : (
                  reversedChapters.map((ch, i) => (
                    <Link key={ch._id} href={`/manga/${id}/read/${ch._id}`} style={{ textDecoration: "none" }}>
                      <div className="chapter-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "rgba(255,255,255,0.025)", borderRadius: "14px", cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <div style={{ width: "42px", height: "42px", borderRadius: "10px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: i === 0 ? "linear-gradient(135deg, #FF6B35, #E63946)" : "rgba(255,255,255,0.05)", border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.07)", boxShadow: i === 0 ? "0 0 16px rgba(255,107,53,0.3)" : "none" }}>
                            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.05em", color: i === 0 ? "#fff" : "rgba(255,255,255,0.4)" }}>{ch.chapterNumber}</span>
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <p className="ch-title" style={{ fontSize: "0.875rem", fontWeight: 700, color: "rgba(255,255,255,0.8)", fontFamily: "'Noto Sans JP', sans-serif", transition: "color 0.2s" }}>
                                Chapter {ch.chapterNumber}{ch.title ? `: ${ch.title}` : ""}
                              </p>
                              {i === 0 && <span style={{ fontSize: "9px", fontWeight: 900, background: "linear-gradient(135deg, #FF6B35, #E63946)", color: "#fff", padding: "2px 7px", borderRadius: "20px", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>Latest</span>}
                            </div>
                            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "3px", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.05em" }}>{timeAgo(ch.publishedAt || ch.createdAt)}</p>
                          </div>
                        </div>
                        <span className="ch-arrow" style={{ color: "rgba(255,255,255,0.2)", fontSize: "1.1rem", transition: "color 0.2s", flexShrink: 0 }}>→</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {/* About */}
            {tab === "about" && (
              <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0 }}>
                    <div style={{ width: "clamp(110px, 12vw, 160px)", aspectRatio: "2/3", borderRadius: "14px", overflow: "hidden", border: "2px solid rgba(255,107,53,0.15)", boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}>
                      <CoverImage manga={manga} size="small" />
                    </div>
                  </div>
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", padding: "1.75rem", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderLeft: "36px solid transparent", borderTop: "36px solid rgba(255,107,53,0.08)" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                      <div style={{ width: "16px", height: "2px", background: "#FF6B35" }} />
                      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>Synopsis</span>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9375rem", lineHeight: 1.85, fontWeight: 300 }}>{manga.description || "No description available."}</p>
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "18px", padding: "1.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.25rem" }}>
                    <div style={{ width: "16px", height: "2px", background: "#FF6B35" }} />
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>Details</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
                    {[
                      { label: "Author",   value: manga.author || "N/A" },
                      { label: "Artist",   value: manga.artist || "N/A" },
                      { label: "Status",   value: manga.status },
                      { label: "Year",     value: manga.year?.toString() ?? "N/A" },
                      { label: "Chapters", value: chapters.length.toString() },
                      { label: "Rating",   value: manga.rating > 0 ? `${manga.rating.toFixed(1)} / 10` : "N/A" },
                      { label: "Source",   value: "MangaDex" },
                    ].map(f => (
                      <div key={f.label} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.025)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,107,53,0.5)", marginBottom: "5px" }}>{f.label}</p>
                        <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "rgba(255,255,255,0.8)", fontFamily: "'Noto Sans JP', sans-serif" }}>{f.value}</p>
                      </div>
                    ))}
                  </div>
                  {manga.genre.length > 0 && (
                    <div style={{ marginTop: "1rem", padding: "12px 14px", background: "rgba(255,255,255,0.025)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,107,53,0.5)", marginBottom: "10px" }}>Genres</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {manga.genre.map(g => (<Link key={g} href={`/browse?genre=${encodeURIComponent(g)}`} className="genre-badge">{g}</Link>))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}