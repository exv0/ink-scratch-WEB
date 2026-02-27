"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { mangaService, Manga, Chapter } from "@/lib/services/manga.service";

type Tab = "chapters" | "about";

function statusStyle(status: string): React.CSSProperties {
  if (status === "Ongoing")   return { background: "rgba(34,197,94,0.15)",  color: "#4ade80",  border: "1px solid rgba(34,197,94,0.3)"  };
  if (status === "Completed") return { background: "rgba(59,130,246,0.15)", color: "#60a5fa",  border: "1px solid rgba(59,130,246,0.3)" };
  if (status === "Cancelled") return { background: "rgba(239,68,68,0.15)",  color: "#f87171",  border: "1px solid rgba(239,68,68,0.3)"  };
  return                             { background: "rgba(245,158,11,0.15)", color: "#fbbf24",  border: "1px solid rgba(245,158,11,0.3)" };
}

function CoverImage({ manga }: { manga: Manga }) {
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
    return <img src={manga.coverImage} alt={manga.title} onError={() => setImgError(true)}
      style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  }
  return (
    <div style={{ width: "100%", height: "100%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: "radial-gradient(circle, #FF6B35 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
      <span style={{ fontSize: "3rem", opacity: 0.12, userSelect: "none" }}>📕</span>
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

  const [manga,     setManga]     = useState<Manga | null>(null);
  const [chapters,  setChapters]  = useState<Chapter[]>([]);
  const [tab,       setTab]       = useState<Tab>("chapters");
  const [inLibrary, setInLibrary] = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

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
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "40px", height: "40px", margin: "0 auto 16px", border: "3px solid rgba(255,107,53,0.2)", borderTop: "3px solid #FF6B35", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading…</p>
      </div>
    </div>
  );

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !manga) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</p>
        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.05em", color: "#fff", marginBottom: "0.5rem" }}>Failed to Load</p>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>{error}</p>
        <Link href="/manga">
          <button style={{ padding: "10px 28px", background: "linear-gradient(135deg, #FF6B35, #E63946)", border: "none", borderRadius: "12px", color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em", cursor: "pointer", boxShadow: "0 0 20px rgba(255,107,53,0.3)" }}>
            Back to Browse
          </button>
        </Link>
      </div>
    </div>
  );

  const latestChapter = chapters[chapters.length - 1];
  const firstChapter  = chapters[0];
  const reversedChapters = [...chapters].reverse();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@300;400;500;700;900&family=Share+Tech+Mono&display=swap');

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ink-float {
          0%   { opacity: 0; transform: translateY(0) scale(0.5) rotate(0deg); }
          15%  { opacity: 0.7; }
          85%  { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-600px) scale(1.5) rotate(180deg); }
        }
        .ink-float { animation: ink-float linear infinite; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.75s cubic-bezier(0.16,1,0.3,1) both; }

        .chapter-row {
          transition: all 0.25s ease;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .chapter-row:hover {
          border-color: rgba(255,107,53,0.3) !important;
          background: rgba(255,107,53,0.04) !important;
          transform: translateX(4px);
        }
        .chapter-row:hover .ch-arrow { color: #FF6B35 !important; }
        .chapter-row:hover .ch-title { color: #FF6B35 !important; }

        .tab-btn { transition: all 0.2s; cursor: pointer; }

        .lib-btn { transition: all 0.25s; }
        .lib-btn:hover { transform: translateY(-1px); }

        .action-btn { transition: all 0.25s; }
        .action-btn:hover { transform: translateY(-2px); box-shadow: 0 0 30px rgba(255,107,53,0.4) !important; }

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
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="ink-float" style={{
              position: "absolute", left: `${(i * 53 + 7) % 92}%`, bottom: "-10px",
              width: `${3 + (i % 4) * 2}px`, height: `${3 + (i % 4) * 2}px`,
              borderRadius: "50%",
              background: i % 2 === 0 ? "radial-gradient(circle, rgba(255,107,53,0.5), transparent)" : "radial-gradient(circle, rgba(230,57,70,0.4), transparent)",
              animationDelay: `${i * 1.1}s`, animationDuration: `${8 + (i % 4)}s`,
              filter: "blur(1.5px)",
            }} />
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 10 }}>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* HERO                                                        */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            {/* Blurred cover BG */}
            {manga.coverImage && (
              <div style={{ position: "absolute", inset: 0, opacity: 0.12 }}>
                <img src={manga.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(30px)", transform: "scale(1.1)" }} />
              </div>
            )}
            {/* Dark overlay */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,15,0.6) 0%, rgba(10,10,15,0.9) 100%)" }} />
            {/* Diagonal lines */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "repeating-linear-gradient(-55deg, transparent, transparent 60px, rgba(255,107,53,1) 60px, rgba(255,107,53,1) 61px)" }} />

            <div style={{ position: "relative", maxWidth: "1024px", margin: "0 auto", padding: "clamp(5rem,10vw,7rem) 1.5rem 0" }}>
              {/* Breadcrumb */}
              <nav style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.5rem" }} className="fade-up">
                {[
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/manga",     label: "Browse"    },
                ].map((item, i) => (
                  <span key={item.href} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Link href={item.href} style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#FF6B35"}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.3)"}
                    >{item.label}</Link>
                    <span style={{ color: "rgba(255,107,53,0.35)", fontFamily: "'Share Tech Mono', monospace", fontSize: "10px" }}>›</span>
                  </span>
                ))}
                <span style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.1em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>
                  {manga.title.toUpperCase()}
                </span>
              </nav>

              {/* Cover + info */}
              <div style={{ display: "flex", gap: "2rem", alignItems: "flex-end", paddingBottom: "2rem" }} className="fade-up">
                {/* Cover */}
                <div style={{ flexShrink: 0, display: "none" }} className="sm:block">
                  <div style={{ width: "clamp(120px, 14vw, 176px)", aspectRatio: "3/4", borderRadius: "16px", overflow: "hidden", border: "2px solid rgba(255,107,53,0.2)", boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(255,107,53,0.1)" }}>
                    <CoverImage manga={manga} />
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Chapter tag */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.875rem" }}>
                    <div style={{ width: "20px", height: "2px", background: "#FF6B35", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>
                      Manga Detail
                    </span>
                  </div>

                  {/* Genre + status badges */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "0.875rem" }}>
                    {manga.genre.slice(0, 4).map(g => (
                      <span key={g} style={{ fontSize: "9px", fontWeight: 900, color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(4px)", padding: "3px 10px", borderRadius: "20px", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.1)" }}>
                        {g}
                      </span>
                    ))}
                    <span style={{ ...statusStyle(manga.status), fontSize: "9px", fontWeight: 900, padding: "3px 10px", borderRadius: "20px", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {manga.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 6vw, 4rem)", letterSpacing: "0.03em", lineHeight: 0.92, marginBottom: "0.5rem", background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.85) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {manga.title}
                  </h1>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", marginBottom: "0.875rem", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.06em" }}>
                    by {manga.author}
                  </p>

                  {/* Rating */}
                  {manga.rating > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "1.25rem" }}>
                      {[1,2,3,4,5].map(star => (
                        <span key={star} style={{ color: manga.rating / 2 >= star ? "#F4D03F" : "rgba(255,255,255,0.15)", fontSize: "14px" }}>★</span>
                      ))}
                      <span style={{ color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem", letterSpacing: "0.05em", marginLeft: "4px" }}>{manga.rating.toFixed(1)}</span>
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", fontFamily: "'Share Tech Mono', monospace" }}>/ 10</span>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {firstChapter && (
                      <Link href={`/manga/${id}/read/${firstChapter._id}`} style={{ textDecoration: "none" }}>
                        <button className="action-btn" style={{ padding: "11px 24px", background: "#fff", color: "#0a0a0f", border: "none", borderRadius: "12px", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em", cursor: "pointer", boxShadow: "0 0 20px rgba(255,255,255,0.15)", display: "flex", alignItems: "center", gap: "6px" }}>
                          📖 Start Reading
                        </button>
                      </Link>
                    )}
                    {latestChapter && latestChapter._id !== firstChapter?._id && (
                      <Link href={`/manga/${id}/read/${latestChapter._id}`} style={{ textDecoration: "none" }}>
                        <button className="action-btn" style={{ padding: "11px 24px", background: "linear-gradient(135deg, #FF6B35, #E63946)", color: "#fff", border: "none", borderRadius: "12px", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em", cursor: "pointer", boxShadow: "0 0 24px rgba(255,107,53,0.4)", display: "flex", alignItems: "center", gap: "6px", position: "relative", overflow: "hidden" }}>
                          ⚡ Latest Chapter
                          <span style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderLeft: "14px solid transparent", borderTop: "14px solid rgba(255,255,255,0.15)" }} />
                        </button>
                      </Link>
                    )}
                    <button className="lib-btn" onClick={() => setInLibrary(v => !v)} style={{
                      padding: "11px 24px",
                      background: inLibrary ? "rgba(255,107,53,0.12)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${inLibrary ? "rgba(255,107,53,0.4)" : "rgba(255,255,255,0.12)"}`,
                      borderRadius: "12px", color: inLibrary ? "#FF6B35" : "rgba(255,255,255,0.6)",
                      fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em",
                      cursor: "pointer",
                    }}>
                      {inLibrary ? "✓ In Library" : "+ Add to Library"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div style={{ position: "relative", borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)" }}>
              <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
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

          {/* ══════════════════════════════════════════════════════════ */}
          {/* TABS + CONTENT                                              */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "0 1.5rem" }}>

            {/* Tab row */}
            <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginTop: "1.75rem" }}>
              {(["chapters", "about"] as Tab[]).map(t => (
                <button key={t} className="tab-btn" onClick={() => setTab(t)} style={{
                  padding: "10px 20px",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1rem", letterSpacing: "0.1em",
                  background: "transparent", border: "none",
                  borderBottom: `2px solid ${tab === t ? "#FF6B35" : "transparent"}`,
                  marginBottom: "-1px",
                  color: tab === t ? "#FF6B35" : "rgba(255,255,255,0.35)",
                  textTransform: "capitalize",
                }}>
                  {t}{t === "chapters" && ` (${chapters.length})`}
                </button>
              ))}
            </div>

            {/* ── Chapters tab ── */}
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
                      <div className="chapter-row" style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "14px 18px",
                        background: "rgba(255,255,255,0.025)",
                        borderRadius: "14px",
                        cursor: "pointer",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          {/* Chapter number badge */}
                          <div style={{
                            width: "42px", height: "42px", borderRadius: "10px", flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: i === 0 ? "linear-gradient(135deg, #FF6B35, #E63946)" : "rgba(255,255,255,0.05)",
                            border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.07)",
                            boxShadow: i === 0 ? "0 0 16px rgba(255,107,53,0.3)" : "none",
                          }}>
                            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.05em", color: i === 0 ? "#fff" : "rgba(255,255,255,0.4)" }}>
                              {ch.chapterNumber}
                            </span>
                          </div>
                          {/* Title + date */}
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <p className="ch-title" style={{ fontSize: "0.875rem", fontWeight: 700, color: "rgba(255,255,255,0.8)", fontFamily: "'Noto Sans JP', sans-serif", transition: "color 0.2s" }}>
                                Chapter {ch.chapterNumber}{ch.title ? `: ${ch.title}` : ""}
                              </p>
                              {i === 0 && (
                                <span style={{ fontSize: "9px", fontWeight: 900, background: "linear-gradient(135deg, #FF6B35, #E63946)", color: "#fff", padding: "2px 7px", borderRadius: "20px", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                                  Latest
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "3px", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.05em" }}>
                              {timeAgo(ch.publishedAt || ch.createdAt)}
                            </p>
                          </div>
                        </div>
                        {/* Arrow */}
                        <span className="ch-arrow" style={{ color: "rgba(255,255,255,0.2)", fontSize: "1.1rem", transition: "color 0.2s", flexShrink: 0 }}>→</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {/* ── About tab ── */}
            {tab === "about" && (
              <div style={{ marginTop: "1.25rem" }}>
                {/* Synopsis card */}
                <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", padding: "1.75rem", marginBottom: "1rem", position: "relative", overflow: "hidden" }}>
                  {/* Corner accent */}
                  <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderLeft: "36px solid transparent", borderTop: "36px solid rgba(255,107,53,0.08)" }} />

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                    <div style={{ width: "16px", height: "2px", background: "#FF6B35", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>Synopsis</span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9375rem", lineHeight: 1.85, fontWeight: 300 }}>
                    {manga.description || "No description available."}
                  </p>
                </div>

                {/* Details grid */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "18px", padding: "1.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.25rem" }}>
                    <div style={{ width: "16px", height: "2px", background: "#FF6B35", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>Details</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem" }}>
                    {[
                      { label: "Author",  value: manga.author },
                      { label: "Artist",  value: manga.artist },
                      { label: "Status",  value: manga.status },
                      { label: "Genres",  value: manga.genre.join(", ") || "N/A" },
                      { label: "Year",    value: manga.year?.toString() ?? "N/A" },
                      { label: "Source",  value: "MangaDex" },
                    ].map(f => (
                      <div key={f.label} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.025)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,107,53,0.5)", marginBottom: "5px" }}>{f.label}</p>
                        <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "rgba(255,255,255,0.8)", fontFamily: "'Noto Sans JP', sans-serif" }}>{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}