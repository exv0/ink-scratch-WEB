// app/(auth)/layout.tsx
"use client";

import Link from "next/link";

// ── Floating ink particles (decorative, match homepage aesthetic) ─────────────
function Particle({ x, delay, size }: { x: number; delay: number; size: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none animate-ink-float"
      style={{
        left: `${x}%`,
        bottom: "-20px",
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, rgba(255,107,53,0.5) 0%, rgba(230,57,70,0.2) 60%, transparent 100%)`,
        animationDelay: `${delay}s`,
        animationDuration: `${7 + (x % 5)}s`,
        filter: "blur(1px)",
      }}
    />
  );
}

const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: (i * 41 + 7) % 90,
  delay: i * 0.9,
  size: 4 + (i % 4) * 3,
}));

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--bg)",
      }}
    >
      {/* ── Left panel — Form ──────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
      }}>
        {/* Subtle halftone grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] halftone"
          style={{ zIndex: 0 }}
        />

        {/* Back to home */}
        <Link href="/" style={{
          position: "absolute",
          top: "1.5rem",
          left: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          textDecoration: "none",
          color: "var(--text-muted)",
          fontSize: "0.8125rem",
          fontWeight: 600,
          transition: "color 0.15s",
          zIndex: 10,
        }}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--orange)"}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: "1rem", height: "1rem" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to home
        </Link>

        {/* Form container */}
        <div style={{
          width: "100%",
          maxWidth: "26rem",
          position: "relative",
          zIndex: 1,
        }}>
          {children}
        </div>
      </div>

      {/* ── Right panel — Brand visual (desktop only) ──────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          flex: 1,
          position: "relative",
          background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f3460 100%)",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Gradient orbs */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,107,53,0.25) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(230,57,70,0.2) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }} />

        {/* Halftone overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,107,53,0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.5,
          }}
        />

        {/* Speed lines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(15deg, transparent 40%, rgba(255,107,53,0.02) 50%, transparent 60%)",
        }} />

        {/* Ink particles */}
        {particles.map(p => <Particle key={p.id} {...p} />)}

        {/* Central content */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "2rem", maxWidth: "380px" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
            <div style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "0.875rem",
              background: "linear-gradient(135deg, var(--orange), var(--red))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(255,107,53,0.4)",
            }}>
              <span style={{ color: "#fff", fontSize: "1rem", fontWeight: 900, fontFamily: "var(--font-display)" }}>IS</span>
            </div>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.875rem",
              letterSpacing: "0.08em",
              background: "linear-gradient(135deg, #fff 0%, rgba(255,107,53,0.9) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              INK SCRATCH
            </span>
          </div>

          {/* Big display text */}
          <div style={{ marginBottom: "1.5rem", lineHeight: 1 }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 6vw, 5rem)",
              letterSpacing: "0.06em",
              color: "rgba(255,255,255,0.06)",
              WebkitTextStroke: "1px rgba(255,107,53,0.25)",
              userSelect: "none",
              lineHeight: 1,
            }}>
              READ
            </div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 6vw, 5rem)",
              letterSpacing: "0.06em",
              background: "linear-gradient(135deg, var(--orange), var(--red))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1,
            }}>
              EXPLORE
            </div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 6vw, 5rem)",
              letterSpacing: "0.06em",
              color: "#fff",
              lineHeight: 1,
            }}>
              DISCOVER
            </div>
          </div>

          <p style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "0.9375rem",
            lineHeight: 1.6,
            fontFamily: "var(--font-body)",
          }}>
            Thousands of manga, comics & novels — one portal, every device.
          </p>

          {/* Manga panel decoration */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "2.5rem",
            opacity: 0.3,
          }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{
                border: "1px solid rgba(255,107,53,0.5)",
                borderRadius: "4px",
                width: i === 3 ? 56 : 28,
                height: 36,
                background: i === 3 ? "rgba(255,107,53,0.08)" : "transparent",
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}