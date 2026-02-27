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
  progress: number;
  updatedAt: number;
}

interface LibraryEntry {
  mangaId: string;
  title: string;
  coverImage: string;
  addedAt: number;
}

function getHistory(): ReadingEntry[] {
  try { return JSON.parse(localStorage.getItem(LS_HISTORY_KEY) || "[]"); }
  catch { return []; }
}

function getLibrary(): LibraryEntry[] {
  try { return JSON.parse(localStorage.getItem(LS_LIBRARY_KEY) || "[]"); }
  catch { return []; }
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// ── Cover with fallback ────────────────────────────────────────────────────────
function Cover({ src, title, className, style }: { src?: string; title: string; className?: string; style?: React.CSSProperties }) {
  const [err, setErr] = useState(false);
  const gradients = [
    "linear-gradient(145deg, #2a0a0a, #1a0a1a)",
    "linear-gradient(145deg, #0a1a2a, #0a0a2a)",
    "linear-gradient(145deg, #1a0a2e, #0d1a3a)",
    "linear-gradient(145deg, #0a2a1a, #0a1a0a)",
    "linear-gradient(145deg, #2a1a0a, #1a0a0a)",
    "linear-gradient(145deg, #1a1a0a, #2a0a1a)",
  ];
  const bg = gradients[title.charCodeAt(0) % gradients.length];

  if (src && !err) {
    return <img src={src} alt={title} className={className} onError={() => setErr(true)} style={{ objectFit: "cover", ...style }} />;
  }
  return (
    <div className={className} style={{
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      ...style,
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.08,
        backgroundImage: "radial-gradient(circle, #FF6B35 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }} />
      <span style={{ fontSize: "2rem", opacity: 0.15, userSelect: "none" }}>📕</span>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────────
function Skeleton({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "16px",
      animation: "pulse 2s ease-in-out infinite",
      ...style,
    }} />
  );
}

// ── Section Header ─────────────────────────────────────────────────────────────
function SectionHeader({ title, sub, href, chapter }: { title: string; sub: string; href: string; chapter: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1.5rem" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
          <div style={{ width: "20px", height: "2px", background: "#FF6B35", marginRight: "10px", flexShrink: 0 }} />
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>
            {chapter}
          </span>
        </div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.04em", color: "#fff", lineHeight: 1, marginBottom: "0.25rem" }}>
          {title}
        </h2>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8125rem", fontFamily: "'Noto Sans JP', sans-serif" }}>{sub}</p>
      </div>
      <Link href={href} style={{
        color: "#FF6B35", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem",
        textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase",
        border: "1px solid rgba(255,107,53,0.2)", borderRadius: "10px", padding: "6px 14px",
        transition: "all 0.2s",
        display: "inline-block",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,107,53,0.08)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,107,53,0.4)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,107,53,0.2)"; }}
      >
        View All →
      </Link>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────
function EmptyState({ icon, message, sub, href, cta }: { icon: string; message: string; sub: string; href: string; cta: string }) {
  return (
    <div style={{
      textAlign: "center", padding: "4rem 2rem",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "20px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "radial-gradient(circle, #FF6B35 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }} />
      <p style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{icon}</p>
      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.05em", color: "#fff", marginBottom: "0.5rem" }}>{message}</p>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.875rem", fontFamily: "'Noto Sans JP', sans-serif", maxWidth: "300px", margin: "0 auto 1.5rem", lineHeight: 1.6 }}>{sub}</p>
      <Link href={href}>
        <button style={{
          padding: "10px 24px",
          background: "linear-gradient(135deg, #FF6B35, #E63946)",
          border: "none", borderRadius: "12px", color: "#fff",
          fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em",
          cursor: "pointer",
          boxShadow: "0 0 20px rgba(255,107,53,0.3)",
        }}>
          {cta}
        </button>
      </Link>
    </div>
  );
}

// ── Manga Grid Row ─────────────────────────────────────────────────────────────
function MangaRow({ manga, loading }: { manga: Manga[]; loading: boolean }) {
  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "1rem" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Skeleton style={{ aspectRatio: "3/4" }} />
            <div style={{ marginTop: "8px", height: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "6px", width: "75%" }} />
            <div style={{ marginTop: "4px", height: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", width: "50%" }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "1rem" }}>
      {manga.map(m => (
        <Link key={m._id} href={`/manga/${m._id}`} style={{ textDecoration: "none" }}>
          <div className="manga-grid-card" style={{ cursor: "pointer" }}>
            <div style={{ position: "relative", aspectRatio: "3/4", borderRadius: "14px", overflow: "hidden" }}>
              <Cover src={m.coverImage} title={m.title} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
              {m.rating > 0 && (
                <div style={{
                  position: "absolute", top: "6px", right: "6px",
                  display: "flex", alignItems: "center", gap: "3px",
                  background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
                  padding: "2px 6px", borderRadius: "20px",
                  border: "1px solid rgba(255,200,0,0.2)",
                }}>
                  <span style={{ color: "#F4D03F", fontSize: "9px" }}>★</span>
                  <span style={{ color: "#fff", fontSize: "9px", fontWeight: 900, fontFamily: "'Share Tech Mono', monospace" }}>{m.rating.toFixed(1)}</span>
                </div>
              )}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
            </div>
            <p style={{ marginTop: "8px", fontSize: "12px", fontWeight: 900, color: "rgba(255,255,255,0.85)", fontFamily: "'Noto Sans JP', sans-serif", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.4 }}>{m.title}</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Share Tech Mono', monospace" }}>{m.author}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [featured,  setFeatured]  = useState<Manga[]>([]);
  const [topRated,  setTopRated]  = useState<Manga[]>([]);
  const [latest,    setLatest]    = useState<Manga[]>([]);
  const [history,   setHistory]   = useState<ReadingEntry[]>([]);
  const [library,   setLibrary]   = useState<LibraryEntry[]>([]);
  const [mangaLoad, setMangaLoad] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    setHistory(getHistory().sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 6));
    setLibrary(getLibrary().sort((a, b) => b.addedAt - a.addedAt).slice(0, 8));
  }, []);

  const fetchManga = useCallback(async () => {
    setMangaLoad(true);
    try {
      const [topRes, latestRes] = await Promise.all([
        mangaService.getAll({ page: 1, limit: 6, sort: "rating" }),
        mangaService.getAll({ page: 1, limit: 6, sort: "latest" }),
      ]);
      setTopRated(topRes.data);
      setLatest(latestRes.data);
      setFeatured(topRes.data.sort(() => Math.random() - 0.5).slice(0, 3));
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
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "40px", height: "40px", margin: "0 auto 16px",
          border: "3px solid rgba(255,107,53,0.2)",
          borderTop: "3px solid #FF6B35",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Loading your library…</p>
      </div>
    </div>
  );

  if (!isAuthenticated) return null;

  const displayName = user?.fullName || user?.username || "Reader";

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@400;500;700;900&family=Share+Tech+Mono&display=swap');

        @keyframes ink-float {
          0%   { opacity: 0; transform: translateY(0) scale(0.5) rotate(0deg); }
          15%  { opacity: 0.7; }
          85%  { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-600px) scale(1.5) rotate(180deg); }
        }
        .animate-ink-float { animation: ink-float linear infinite; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }

        .manga-grid-card { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .manga-grid-card:hover { transform: translateY(-6px) scale(1.03); }
        .manga-grid-card:hover p:first-of-type { color: #FF6B35 !important; }

        .continue-card { transition: all 0.3s ease; }
        .continue-card:hover { transform: translateY(-4px); border-color: rgba(255,107,53,0.35) !important; }

        .featured-card .cover-img { transition: transform 0.5s ease; }
        .featured-card:hover .cover-img { transform: scale(1.06); }
        .featured-card { transition: transform 0.3s ease; }
        .featured-card:hover { transform: translateY(-4px); }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: rgba(255,107,53,0.35); border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "'Noto Sans JP', sans-serif" }}>

        {/* ── Fixed background ── */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-10%", left: "20%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.3) 0%, transparent 70%)", filter: "blur(90px)", opacity: 0.18 }} />
          <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,57,70,0.4) 0%, transparent 70%)", filter: "blur(80px)", opacity: 0.12 }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle, #FF6B35 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)" }} />
          {/* Ink particles */}
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="animate-ink-float" style={{
              position: "absolute",
              left: `${(i * 43 + 9) % 92}%`,
              bottom: "-10px",
              width: `${3 + (i % 5) * 2}px`,
              height: `${3 + (i % 5) * 2}px`,
              borderRadius: "50%",
              background: i % 2 === 0
                ? "radial-gradient(circle, rgba(255,107,53,0.5), transparent)"
                : "radial-gradient(circle, rgba(230,57,70,0.4), transparent)",
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${8 + (i % 4)}s`,
              filter: "blur(1.5px)",
            }} />
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 10 }}>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* HERO BANNER                                                    */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <div style={{
            position: "relative",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            overflow: "hidden",
            padding: "3rem 1.5rem 2.5rem",
          }}>
            {/* Panel bg overlay */}
            <div style={{
              position: "absolute", inset: 0, opacity: 0.04,
              backgroundImage: "repeating-linear-gradient(-55deg, transparent, transparent 60px, rgba(255,107,53,1) 60px, rgba(255,107,53,1) 61px)",
            }} />
            <div style={{
              position: "absolute", top: "-40px", right: "5%",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(120px, 20vw, 280px)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,107,53,0.06)",
              lineHeight: 1, userSelect: "none", pointerEvents: "none",
              letterSpacing: "0.02em",
            }}>
              LIBRARY
            </div>

            <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }} className="fade-up">
              {/* Chapter tag */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ width: "28px", height: "2px", background: "#FF6B35", marginRight: "12px", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>
                  {greeting()} — Your Dashboard
                </span>
              </div>

              {/* Greeting */}
              <h1 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3rem, 8vw, 6rem)",
                letterSpacing: "0.03em",
                lineHeight: 0.9,
                marginBottom: "0.75rem",
                background: "linear-gradient(135deg, #fff 0%, #FF6B35 60%, #E63946 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                {displayName}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.9375rem", maxWidth: "480px", marginBottom: "2rem", lineHeight: 1.6 }}>
                {history.length > 0
                  ? `You have ${history.length} stor${history.length === 1 ? "y" : "ies"} in progress. Keep the adventure going!`
                  : "Start reading to track your progress here."}
              </p>

              {/* Stat cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem", maxWidth: "520px" }}
                className="sm:grid-cols-4">
                {[
                  { label: "In Progress", value: history.length, icon: "📖" },
                  { label: "In Library",  value: library.length, icon: "📚" },
                  { label: "Top Rated",   value: topRated.length, icon: "⭐" },
                  { label: "Latest",      value: latest.length,  icon: "🆕" },
                ].map(s => (
                  <div key={s.label} style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "16px",
                    padding: "14px 16px",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "2px", background: "linear-gradient(to bottom, transparent, #FF6B35, transparent)" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "1rem" }}>{s.icon}</span>
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.75rem", color: "#fff", lineHeight: 1 }}>{s.value}</span>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", fontFamily: "'Share Tech Mono', monospace", textTransform: "uppercase", letterSpacing: "0.15em" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* MAIN CONTENT                                                   */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem 5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>

              {/* ── Continue Reading ── */}
              <section>
                <SectionHeader title="Continue Reading" sub="Pick up right where you left off" href="/manga" chapter="Chapter 01 — In Progress" />
                {history.length === 0 ? (
                  <EmptyState icon="📖" message="No Reading History Yet" sub="Start reading a manga and it'll appear here automatically" href="/manga" cta="Browse Manga" />
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                    {history.map(entry => (
                      <Link key={entry.mangaId} href={`/manga/${entry.mangaId}/read/${entry.chapterId}`} style={{ textDecoration: "none" }}>
                        <div className="continue-card" style={{
                          background: "rgba(255,255,255,0.025)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          borderRadius: "18px",
                          overflow: "hidden",
                          cursor: "pointer",
                        }}>
                          {/* Cover strip */}
                          <div style={{ position: "relative", height: "160px", overflow: "hidden" }}>
                            <Cover src={entry.coverImage} title={entry.title} className="cover-img" style={{ width: "100%", height: "100%" }} />
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
                            {/* Progress bar */}
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "rgba(0,0,0,0.4)" }}>
                              <div style={{ height: "100%", background: "linear-gradient(90deg, #FF6B35, #E63946)", width: `${entry.progress}%`, transition: "width 0.5s ease" }} />
                            </div>
                            <div style={{ position: "absolute", bottom: "12px", left: "14px", right: "14px" }}>
                              <p style={{ color: "#fff", fontWeight: 900, fontSize: "0.875rem", fontFamily: "'Noto Sans JP', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.title}</p>
                              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", marginTop: "2px", fontFamily: "'Share Tech Mono', monospace" }}>Ch. {entry.chapterNumber}</p>
                            </div>
                          </div>
                          {/* Footer */}
                          <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", fontFamily: "'Share Tech Mono', monospace" }}>{entry.progress}% complete</span>
                            <span style={{
                              color: "#FF6B35", fontSize: "0.75rem", fontFamily: "'Bebas Neue', sans-serif",
                              letterSpacing: "0.08em", background: "rgba(255,107,53,0.1)",
                              border: "1px solid rgba(255,107,53,0.2)", borderRadius: "8px",
                              padding: "3px 10px",
                            }}>
                              Continue →
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* ── Featured Today ── */}
              <section>
                <SectionHeader title="Featured Today" sub="Handpicked titles you might enjoy" href="/manga" chapter="Chapter 02 — Featured" />
                {mangaLoad ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} style={{ height: "260px" }} />)}
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                    {featured.map((m, i) => (
                      <Link key={m._id} href={`/manga/${m._id}`} style={{ textDecoration: "none" }}>
                        <div className="featured-card" style={{
                          position: "relative", height: "260px",
                          borderRadius: "18px", overflow: "hidden",
                          cursor: "pointer", border: "1px solid rgba(255,255,255,0.06)",
                        }}>
                          <Cover src={m.coverImage} title={m.title} className="cover-img" style={{ width: "100%", height: "100%" }} />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
                          {/* Badges */}
                          <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px" }}>
                            {i === 0 && (
                              <span style={{
                                background: "linear-gradient(135deg, #FF6B35, #E63946)",
                                color: "#fff", fontSize: "9px", fontWeight: 900,
                                fontFamily: "'Share Tech Mono', monospace",
                                padding: "3px 8px", borderRadius: "20px", letterSpacing: "0.1em", textTransform: "uppercase",
                              }}>Featured</span>
                            )}
                          </div>
                          {m.rating > 0 && (
                            <div style={{
                              position: "absolute", top: "12px", right: "12px",
                              display: "flex", alignItems: "center", gap: "3px",
                              background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
                              padding: "3px 8px", borderRadius: "20px",
                              border: "1px solid rgba(255,200,0,0.2)",
                            }}>
                              <span style={{ color: "#F4D03F", fontSize: "10px" }}>★</span>
                              <span style={{ color: "#fff", fontSize: "10px", fontWeight: 900, fontFamily: "'Share Tech Mono', monospace" }}>{m.rating.toFixed(1)}</span>
                            </div>
                          )}
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem" }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "6px" }}>
                              {m.genre.slice(0, 2).map(g => (
                                <span key={g} style={{
                                  fontSize: "9px", fontWeight: 900, color: "rgba(255,255,255,0.65)",
                                  background: "rgba(255,255,255,0.12)", backdropFilter: "blur(4px)",
                                  padding: "2px 8px", borderRadius: "20px",
                                  fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase",
                                }}>{g}</span>
                              ))}
                            </div>
                            <p style={{ color: "#fff", fontWeight: 900, fontSize: "1rem", fontFamily: "'Noto Sans JP', sans-serif", lineHeight: 1.3 }}>{m.title}</p>
                            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", marginTop: "4px", fontFamily: "'Share Tech Mono', monospace" }}>by {m.author}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* ── Top Rated ── */}
              <section>
                <SectionHeader title="Top Rated" sub="The best manga in the library" href="/manga" chapter="Chapter 03 — Top Rated" />
                <MangaRow manga={topRated} loading={mangaLoad} />
              </section>

              {/* ── Recently Updated ── */}
              <section>
                <SectionHeader title="Recently Updated" sub="Fresh chapters just added" href="/manga" chapter="Chapter 04 — Latest" />
                <MangaRow manga={latest} loading={mangaLoad} />
              </section>

              {/* ── My Library ── */}
              <section>
                <SectionHeader title="My Library" sub="Your saved titles" href="/manga" chapter="Chapter 05 — Library" />
                {library.length === 0 ? (
                  <EmptyState icon="📚" message="Your Library Is Empty" sub='Hit "+ Add to Library" on any manga page to save it here' href="/manga" cta="Browse Manga" />
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "1rem" }}>
                    {library.map(entry => (
                      <Link key={entry.mangaId} href={`/manga/${entry.mangaId}`} style={{ textDecoration: "none" }}>
                        <div className="manga-grid-card" style={{ cursor: "pointer" }}>
                          <div style={{ position: "relative", aspectRatio: "3/4", borderRadius: "12px", overflow: "hidden" }}>
                            <Cover src={entry.coverImage} title={entry.title} style={{ width: "100%", height: "100%" }} />
                          </div>
                          <p style={{ marginTop: "6px", fontSize: "11px", fontWeight: 900, color: "rgba(255,255,255,0.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Noto Sans JP', sans-serif" }}>{entry.title}</p>
                        </div>
                      </Link>
                    ))}
                    {/* Add more slot */}
                    <Link href="/manga" style={{ textDecoration: "none" }}>
                      <div className="manga-grid-card" style={{ cursor: "pointer" }}>
                        <div style={{
                          aspectRatio: "3/4", borderRadius: "12px",
                          border: "1.5px dashed rgba(255,107,53,0.2)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: "rgba(255,107,53,0.03)",
                          transition: "all 0.2s",
                        }}>
                          <span style={{ color: "rgba(255,107,53,0.4)", fontSize: "1.5rem" }}>+</span>
                        </div>
                        <p style={{ marginTop: "6px", fontSize: "11px", color: "rgba(255,255,255,0.25)", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.05em" }}>Add More</p>
                      </div>
                    </Link>
                  </div>
                )}
              </section>

              {/* ── Browse CTA ── */}
              <section style={{
                position: "relative",
                background: "rgba(255,107,53,0.04)",
                border: "1px solid rgba(255,107,53,0.12)",
                borderRadius: "24px",
                padding: "3.5rem 2rem",
                textAlign: "center",
                overflow: "hidden",
              }}>
                {/* Diagonal slash bg */}
                <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(255,107,53,0.8) 30px, rgba(255,107,53,0.8) 31px)" }} />
                {/* Ghost text */}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", pointerEvents: "none" }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(80px, 15vw, 180px)", color: "transparent", WebkitTextStroke: "1px rgba(255,107,53,0.06)", lineHeight: 1, userSelect: "none", letterSpacing: "0.04em" }}>
                    DISCOVER
                  </span>
                </div>
                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1rem" }}>
                    <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,107,53,0.25))", maxWidth: "80px" }} />
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.5)" }}>Final Arc</span>
                    <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(255,107,53,0.25), transparent)", maxWidth: "80px" }} />
                  </div>
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.04em", color: "#fff", marginBottom: "0.5rem", lineHeight: 1 }}>
                    Discover New Stories
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.3)", marginBottom: "2rem", fontSize: "0.9rem", fontFamily: "'Noto Sans JP', sans-serif" }}>
                    Thousands of manga titles waiting for you
                  </p>
                  <Link href="/manga">
                    <button style={{
                      padding: "14px 36px",
                      background: "linear-gradient(135deg, #FF6B35, #E63946)",
                      border: "none", borderRadius: "14px", color: "#fff",
                      fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem", letterSpacing: "0.1em",
                      cursor: "pointer",
                      boxShadow: "0 0 30px rgba(255,107,53,0.35), 0 0 70px rgba(255,107,53,0.12)",
                      transition: "all 0.3s ease",
                      position: "relative", overflow: "hidden",
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.03)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 45px rgba(255,107,53,0.5), 0 0 90px rgba(255,107,53,0.2)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px rgba(255,107,53,0.35), 0 0 70px rgba(255,107,53,0.12)"; }}
                    >
                      Browse All Titles →
                    </button>
                  </Link>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}