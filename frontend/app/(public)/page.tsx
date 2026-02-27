"use client";

import Link from "next/link";
import Header from "./_components/Header";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// ── Floating ink particle ────────────────────────────────────────────────────
function InkParticle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <div
      className="absolute rounded-full opacity-0 animate-ink-float pointer-events-none"
      style={{
        left: `${x}%`,
        bottom: "-20px",
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, rgba(255,107,53,0.6) 0%, rgba(230,57,70,0.3) 60%, transparent 100%)`,
        animationDelay: `${delay}s`,
        animationDuration: `${6 + Math.random() * 4}s`,
        filter: "blur(1px)",
      }}
    />
  );
}

// ── Manga panel decorative element ───────────────────────────────────────────
function SpeedLine({ angle, opacity }: { angle: number; opacity: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `linear-gradient(${angle}deg, transparent 40%, rgba(255,107,53,${opacity}) 50%, transparent 60%)`,
      }}
    />
  );
}

// ── Halftone dot grid decoration ─────────────────────────────────────────────
function HalftoneGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.04]"
      style={{
        backgroundImage: `radial-gradient(circle, #FF6B35 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }}
    />
  );
}

// ── Animated counter ─────────────────────────────────────────────────────────
function AnimatedStat({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let frame: number;
    const duration = 1800;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [started, value]);

  return (
    <div ref={ref} className="text-center group">
      <div className="text-4xl md:text-5xl font-black text-white font-display tabular-nums">
        {count.toLocaleString()}<span className="text-orange-500">{suffix}</span>
      </div>
      <div className="text-sm text-white/40 uppercase tracking-widest mt-1 font-mono">{label}</div>
    </div>
  );
}

// ── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon, title, description, accent, delay,
}: {
  icon: string; title: string; description: string; accent: string; delay: string;
}) {
  return (
    <div
      className="relative group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm hover:border-orange-500/30 transition-all duration-500 hover:-translate-y-1"
      style={{ animationDelay: delay }}
    >
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at top right, ${accent}20, transparent 70%)` }} />

      {/* Manga panel diagonal line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="text-4xl mb-4 filter drop-shadow-lg">{icon}</div>
      <h3 className="text-lg font-black text-white mb-2 tracking-tight font-display">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>

      {/* Chapter number decoration */}
      <div className="absolute bottom-4 right-4 text-[10px] font-mono text-white/10 uppercase tracking-widest">
        {title.slice(0, 3).toUpperCase()}
      </div>
    </div>
  );
}

// ─── Genre badge ──────────────────────────────────────────────────────────────
function GenreBadge({ label, active }: { label: string; active?: boolean }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer hover:scale-105 ${
      active
        ? "bg-orange-500/20 border-orange-500/50 text-orange-400"
        : "bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
    }`}>
      {label}
    </span>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Destination for CTAs: browse if logged in, register/login if not
  const ctaPrimaryHref = isAuthenticated ? "/manga" : "/register";
  const ctaSecondaryHref = isAuthenticated ? "/dashboard" : "/login";
  const ctaPrimaryLabel = isAuthenticated ? "Browse Manga" : "Start Reading Free";
  const ctaSecondaryLabel = isAuthenticated ? "Go to Dashboard" : "Log In";

  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    delay: i * 0.7,
    x: (i * 37 + 11) % 95,
    size: 4 + (i % 5) * 3,
  }));

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@400;700;900&family=Share+Tech+Mono&display=swap');

        :root {
          --ink: #0a0a0f;
          --ink-1: #111118;
          --ink-2: #16161f;
          --orange: #FF6B35;
          --red: #E63946;
          --glow: rgba(255,107,53,0.15);
        }

        .font-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.03em; }
        .font-jp { font-family: 'Noto Sans JP', sans-serif; }
        .font-mono-custom { font-family: 'Share Tech Mono', monospace; }

        @keyframes ink-float {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          15% { opacity: 0.8; }
          85% { opacity: 0.4; }
          100% { opacity: 0; transform: translateY(-600px) scale(1.5) rotate(180deg); }
        }
        .animate-ink-float { animation: ink-float linear infinite; }

        @keyframes glitch {
          0%, 100% { clip-path: inset(0 0 100% 0); transform: skewX(0); }
          5% { clip-path: inset(20% 0 60% 0); transform: skewX(-2deg); }
          10% { clip-path: inset(50% 0 30% 0); transform: skewX(1deg); }
          15% { clip-path: inset(0 0 100% 0); }
          90% { clip-path: inset(0 0 100% 0); }
          92% { clip-path: inset(10% 0 70% 0); transform: skewX(2deg); }
          96% { clip-path: inset(0 0 100% 0); }
        }
        .glitch-layer {
          animation: glitch 5s infinite;
          color: #FF6B35;
          text-shadow: -2px 0 #E63946;
        }
        .glitch-layer-2 {
          animation: glitch 5s infinite 0.1s;
          color: #E63946;
          text-shadow: 2px 0 #FF6B35;
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        @keyframes border-pulse {
          0%, 100% { border-color: rgba(255,107,53,0.3); }
          50% { border-color: rgba(255,107,53,0.7); }
        }
        .border-pulse { animation: border-pulse 2s ease-in-out infinite; }

        @keyframes panel-reveal {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .panel-reveal { animation: panel-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        .hero-text-stroke {
          -webkit-text-stroke: 2px rgba(255,107,53,0.4);
          color: transparent;
        }

        .ink-texture {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        .chapter-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        /* Manga panel border style */
        .manga-panel {
          position: relative;
        }
        .manga-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 2px solid rgba(255,107,53,0.15);
          border-radius: inherit;
          pointer-events: none;
        }

        /* Scroll-triggered fade in */
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }

        .glow-btn {
          box-shadow: 0 0 20px rgba(255,107,53,0.3), 0 0 60px rgba(255,107,53,0.1), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .glow-btn:hover {
          box-shadow: 0 0 30px rgba(255,107,53,0.5), 0 0 80px rgba(255,107,53,0.2), inset 0 1px 0 rgba(255,255,255,0.15);
        }
      `}</style>

      {/* Background canvas */}
      <div className="fixed inset-0 z-0" style={{ background: "var(--ink)" }}>
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(255,107,53,0.4) 0%, transparent 70%)", filter: "blur(80px)", transform: "translate(-50%, -30%)" }} />
        <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, rgba(230,57,70,0.5) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, rgba(255,107,53,0.6) 0%, transparent 60%)", filter: "blur(120px)", transform: "translate(-50%, -50%)" }} />

        {/* Halftone */}
        <HalftoneGrid />

        {/* Speed lines - subtle */}
        <SpeedLine angle={15} opacity={0.015} />
        <SpeedLine angle={-10} opacity={0.01} />

        {/* Scanline effect */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)" }} />

        {/* Ink particles */}
        {particles.map(p => <InkParticle key={p.id} {...p} />)}
      </div>

      <Header />

      <div className="relative z-10 min-h-screen text-white font-jp">

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-20 px-6 md:pt-40 md:pb-28 overflow-hidden">

          {/* Chapter indicator */}
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8 fade-up" style={{ animationDelay: "0s" }}>
              <div className="w-8 h-[2px] bg-orange-500" />
              <span className="chapter-tag text-orange-500/70">Chapter 01 — The Beginning</span>
            </div>

            {/* Main title with glitch effect */}
            <div className="relative mb-6 fade-up" style={{ animationDelay: "0.15s" }}>
              {/* Outline ghost title */}
              <div className="absolute inset-0 font-display text-[80px] md:text-[140px] lg:text-[180px] leading-none hero-text-stroke select-none"
                style={{ top: "4px", left: "4px" }}>
                INK SCRATCH
              </div>
              {/* Glitch layers */}
              <div className="absolute inset-0 font-display text-[80px] md:text-[140px] lg:text-[180px] leading-none glitch-layer select-none pointer-events-none">
                INK SCRATCH
              </div>
              <div className="absolute inset-0 font-display text-[80px] md:text-[140px] lg:text-[180px] leading-none glitch-layer-2 select-none pointer-events-none">
                INK SCRATCH
              </div>
              {/* Main */}
              <h1 className="relative font-display text-[80px] md:text-[140px] lg:text-[180px] leading-none"
                style={{ background: "linear-gradient(135deg, #fff 0%, #FF6B35 50%, #E63946 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                INK SCRATCH
              </h1>
            </div>

            {/* Subtitle */}
            <div className="relative fade-up" style={{ animationDelay: "0.3s" }}>
              <p className="text-lg md:text-2xl text-white/60 max-w-2xl leading-relaxed font-light mb-2">
                Your portal into thousands of manga, comics & novels.
              </p>
              <p className="text-base md:text-lg text-white/30 max-w-xl leading-relaxed">
                No downloads. No apps. Instant access, synced across every device.
              </p>
            </div>

            {/* Genre tags */}
            <div className="flex flex-wrap gap-2 mt-8 mb-10 fade-up" style={{ animationDelay: "0.45s" }}>
              {["Action", "Romance", "Fantasy", "Horror", "Sci-Fi", "Slice of Life", "Shōnen", "Seinen"].map((g, i) => (
                <GenreBadge key={g} label={g} active={i === 0} />
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 items-start fade-up" style={{ animationDelay: "0.6s" }}>
              <Link href={ctaPrimaryHref}>
                <button className="relative group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-lg rounded-xl glow-btn transition-all duration-300 hover:scale-105 overflow-hidden manga-panel">
                  <span className="relative z-10 font-display tracking-wider">{ctaPrimaryLabel}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Manga corner mark */}
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[16px] border-l-transparent border-t-[16px] border-t-white/20" />
                </button>
              </Link>
              <Link href={ctaSecondaryHref}>
                <button className="px-8 py-4 bg-white/5 text-white/80 font-bold text-lg rounded-xl border border-white/10 hover:border-orange-500/40 hover:bg-white/10 hover:text-white transition-all duration-300">
                  {ctaSecondaryLabel}
                </button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex items-center gap-6 mt-10 fade-up" style={{ animationDelay: "0.75s" }}>
              <div className="flex -space-x-2">
                {["FF6B35", "E63946", "FF9A56", "C0392B", "FF7043"].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0f]"
                    style={{ background: `#${c}`, zIndex: 5 - i }} />
                ))}
              </div>
              <p className="text-sm text-white/40 font-mono-custom">
                <span className="text-orange-400 font-bold">12,000+</span> readers already in the story
              </p>
            </div>
          </div>

          {/* Decorative manga panel on right (desktop) */}
          <div className="hidden lg:block absolute right-8 top-32 w-[280px] opacity-20 pointer-events-none">
            <div className="border border-orange-500/30 rounded-lg p-4 space-y-3" style={{ background: "rgba(255,107,53,0.03)" }}>
              {[70, 45, 85, 30, 60].map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-orange-500/60 to-transparent" style={{ width: `${w}%` }} />
                </div>
              ))}
              <div className="w-full h-24 rounded bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 mt-4 flex items-center justify-center">
                <span className="font-display text-orange-500/60 text-2xl">READ</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ────────────────────────────────────────────────────── */}
        <section className="relative py-12 border-y border-white/5" style={{ background: "rgba(255,107,53,0.03)" }}>
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(90deg, transparent, rgba(255,107,53,0.05) 50%, transparent)" }} />
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedStat value={50000} suffix="+" label="Manga Titles" />
            <AnimatedStat value={2400000} suffix="+" label="Chapters" />
            <AnimatedStat value={12000} suffix="+" label="Active Readers" />
            <AnimatedStat value={99} suffix="%" label="Uptime" />
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────────────── */}
        <section className="relative py-24 px-6">
          <div className="max-w-6xl mx-auto">

            {/* Section header */}
            <div className="flex items-end justify-between mb-16">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-5 h-[2px] bg-orange-500" />
                  <span className="chapter-tag text-orange-500/70">Chapter 02 — Features</span>
                </div>
                <h2 className="font-display text-4xl md:text-6xl text-white leading-none">
                  WHY READERS<br />
                  <span style={{ WebkitTextStroke: "1px rgba(255,107,53,0.6)", color: "transparent" }}>LOVE US</span>
                </h2>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-white/20 font-mono-custom text-xs">VOL.01 / PAGE 002</p>
              </div>
            </div>

            {/* Feature grid */}
            <div className="grid md:grid-cols-3 gap-4">
              <FeatureCard
                icon="⚡"
                title="Instant Access"
                description="Start reading in seconds. No downloads, no installs — just click and dive into the story."
                accent="#FF6B35"
                delay="0s"
              />
              <FeatureCard
                icon="☁️"
                title="Cloud Sync"
                description="Your reading progress follows you everywhere. Pick up exactly where you left off on any device."
                accent="#E63946"
                delay="0.1s"
              />
              <FeatureCard
                icon="📱"
                title="Anywhere"
                description="Phone, tablet, laptop — the reader adapts perfectly to every screen size."
                accent="#FF9A56"
                delay="0.2s"
              />
              <FeatureCard
                icon="🔖"
                title="Smart Bookmarks"
                description="Save favorite panels, chapters, and series with a single tap."
                accent="#FF6B35"
                delay="0.3s"
              />
              <FeatureCard
                icon="🌙"
                title="Dark & Light"
                description="Switch between themes tied to your account — reads great day or night."
                accent="#E63946"
                delay="0.4s"
              />
              <FeatureCard
                icon="🔍"
                title="Powerful Search"
                description="Find manga by genre, author, rating, or status. Discover your next obsession."
                accent="#FF6B35"
                delay="0.5s"
              />
            </div>
          </div>
        </section>

        {/* ── GENRES SECTION ───────────────────────────────────────────────── */}
        <section className="relative py-20 px-6 overflow-hidden border-t border-white/5">
          {/* Background panel effect */}
          <div className="absolute inset-0 opacity-5"
            style={{ background: "repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(255,107,53,0.5) 40px, rgba(255,107,53,0.5) 41px)" }} />

          <div className="max-w-6xl mx-auto relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-5 h-[2px] bg-orange-500" />
              <span className="chapter-tag text-orange-500/70">Chapter 03 — Library</span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl text-white mb-4 leading-none">EVERY GENRE.<br />EVERY STORY.</h2>
            <p className="text-white/40 max-w-xl mb-12">From heart-pounding shōnen battles to quiet slice-of-life moments — your next favorite story is already waiting.</p>

            {/* Scrolling genre strip */}
            <div className="relative overflow-hidden">
              <div className="flex gap-3 flex-wrap">
                {[
                  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror",
                  "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports",
                  "Supernatural", "Thriller", "Historical", "Psychological",
                  "Mecha", "Isekai", "Shōnen", "Shōjo", "Seinen", "Josei",
                ].map((g) => (
                  <span key={g} className="px-4 py-2 rounded-lg border border-white/10 bg-white/[0.03] text-white/50 text-sm font-mono-custom uppercase tracking-wider hover:border-orange-500/40 hover:text-orange-400 transition-all duration-200 cursor-pointer">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
        <section className="relative py-32 px-6 overflow-hidden">
          {/* Dramatic background */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(255,107,53,0.12) 0%, transparent 70%)" }} />
          <div className="absolute inset-0 border-y border-orange-500/10" />

          {/* Big decorative text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <span className="font-display text-[200px] md:text-[300px] opacity-[0.03] text-white select-none leading-none">
              READ
            </span>
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-orange-500/30" />
              <span className="chapter-tag text-orange-500/70">Final Arc</span>
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-orange-500/30" />
            </div>

            <h2 className="font-display text-5xl md:text-8xl text-white leading-none mb-6">
              YOUR STORY<br />
              <span style={{ background: "linear-gradient(135deg, #FF6B35, #E63946)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                STARTS NOW
              </span>
            </h2>

            <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto mb-12">
              Join thousands of readers who've already found their next obsession. Free forever. No credit card required.
            </p>

            <Link href={ctaPrimaryHref}>
              <button className="relative group px-12 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-xl rounded-xl glow-btn transition-all duration-300 hover:scale-105 overflow-hidden">
                <span className="font-display tracking-wider text-2xl">{isAuthenticated ? "Browse Manga" : "Begin the Journey"}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-white/20" />
              </button>
            </Link>

            {/* Manga panel row decoration */}
            <div className="flex items-center justify-center gap-2 mt-16 opacity-20">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="border border-orange-500/40 rounded"
                  style={{ width: i === 3 ? 80 : 40, height: 50, background: i === 3 ? "rgba(255,107,53,0.1)" : "transparent" }} />
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer className="relative border-t border-white/5 py-10 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white text-[9px] font-black">IS</span>
              </div>
              <span className="font-display text-white/60 text-lg tracking-wider">INK SCRATCH</span>
            </div>
            <p className="text-white/20 font-mono-custom text-xs">© 2025 INK SCRATCH · ALL RIGHTS RESERVED</p>
            <div className="flex gap-6">
              {["Terms", "Privacy", "About"].map(l => (
                <Link key={l} href={`/${l.toLowerCase()}`} className="text-white/30 hover:text-orange-400 transition-colors text-sm font-mono-custom uppercase tracking-wider">
                  {l}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}