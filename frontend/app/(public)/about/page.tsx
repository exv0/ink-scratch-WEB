// app/(public)/about/page.tsx
"use client";
import Link from "next/link";
import Header from "../_components/Header";

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@300;400;500;700;900&family=Share+Tech+Mono&display=swap');

        @keyframes ink-float {
          0%   { opacity: 0; transform: translateY(0) scale(0.5) rotate(0deg); }
          15%  { opacity: 0.7; }
          85%  { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-600px) scale(1.5) rotate(180deg); }
        }
        .animate-ink-float { animation: ink-float linear infinite; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.85s cubic-bezier(0.16, 1, 0.3, 1) both; }

        .about-feature-card {
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.3s;
        }
        .about-feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(255,107,53,0.3) !important;
        }
        .about-feature-card:hover .card-underline {
          width: 100% !important;
        }

        .glow-btn {
          box-shadow: 0 0 24px rgba(255,107,53,0.35), 0 0 60px rgba(255,107,53,0.1), inset 0 1px 0 rgba(255,255,255,0.12);
          transition: all 0.3s ease;
        }
        .glow-btn:hover {
          box-shadow: 0 0 40px rgba(255,107,53,0.55), 0 0 90px rgba(255,107,53,0.2), inset 0 1px 0 rgba(255,255,255,0.18);
          transform: translateY(-2px) scale(1.03);
        }
      `}</style>

      {/* ── Fixed background ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "#0a0a0f", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-10%", left: "20%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.3) 0%, transparent 70%)", filter: "blur(90px)", opacity: 0.18 }} />
        <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,57,70,0.4) 0%, transparent 70%)", filter: "blur(80px)", opacity: 0.12 }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle, #FF6B35 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)" }} />
        {/* Ink particles */}
        {[...Array(10)].map((_, i) => (
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
            animationDelay: `${i * 0.9}s`,
            animationDuration: `${8 + (i % 4)}s`,
            filter: "blur(1.5px)",
          }} />
        ))}
      </div>

      <Header />

      <main style={{ position: "relative", zIndex: 10, minHeight: "100vh", color: "#fff", fontFamily: "'Noto Sans JP', sans-serif" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "8rem 1.5rem 5rem" }}>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* HERO                                                        */}
          {/* ══════════════════════════════════════════════════════════ */}
          <div className="fade-up" style={{ textAlign: "center", marginBottom: "5rem", position: "relative" }}>
            {/* Ghost watermark */}
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(80px, 18vw, 220px)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,107,53,0.05)",
              lineHeight: 1, userSelect: "none", pointerEvents: "none",
              whiteSpace: "nowrap", letterSpacing: "0.04em",
            }}>
              ABOUT
            </div>

            {/* Chapter tag */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1.25rem" }}>
              <div style={{ width: "28px", height: "2px", background: "#FF6B35", flexShrink: 0 }} />
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>
                Our Story — Who We Are
              </span>
              <div style={{ width: "28px", height: "2px", background: "#FF6B35", flexShrink: 0 }} />
            </div>

            <h1 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 10vw, 7rem)",
              letterSpacing: "0.04em",
              lineHeight: 0.9,
              marginBottom: "1.25rem",
              background: "linear-gradient(135deg, #fff 0%, #FF6B35 50%, #E63946 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              position: "relative",
            }}>
              About Ink Scratch
            </h1>
            <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "rgba(255,255,255,0.45)", maxWidth: "640px", margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
              The modern way to read mangas, comics, and novels — instantly, anywhere, on any device.
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* MISSION                                                     */}
          {/* ══════════════════════════════════════════════════════════ */}
          <section style={{
            position: "relative",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "24px",
            padding: "clamp(2rem, 5vw, 4rem)",
            marginBottom: "4rem",
            overflow: "hidden",
          }}>
            {/* Halftone bg */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.035, backgroundImage: "radial-gradient(circle, #FF6B35 1px, transparent 1px)", backgroundSize: "22px 22px", pointerEvents: "none" }} />
            {/* Corner accent */}
            <div style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderLeft: "50px solid transparent", borderTop: "50px solid rgba(255,107,53,0.1)", pointerEvents: "none" }} />
            {/* Bottom accent line */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, #FF6B35, #E63946, transparent)", opacity: 0.4 }} />

            <div style={{ position: "relative", textAlign: "center" }}>
              {/* Section header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "1.5rem" }}>
                <div style={{ width: "20px", height: "2px", background: "#FF6B35" }} />
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>
                  Chapter 01 — Our Mission
                </span>
                <div style={{ width: "20px", height: "2px", background: "#FF6B35" }} />
              </div>

              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                letterSpacing: "0.04em",
                color: "#fff",
                marginBottom: "1.5rem",
                lineHeight: 1,
              }}>
                Why I Built This
              </h2>

              <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.85, maxWidth: "800px", margin: "0 auto 1.25rem", fontWeight: 300 }}>
                I made <span style={{ color: "#FF6B35", fontWeight: 700 }}>Ink Scratch</span> as my college project and also so I could bring into life the very website I use on my free time. I wanted to create a modern, seamless reading experience that finally does justice to the incredible stories manga creators are crafting. I hope everyone who views this likes it.
              </p>
              <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.85, maxWidth: "800px", margin: "0 auto", fontWeight: 300 }}>
                Enjoy your experience. 
              </p>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* FEATURES                                                    */}
          {/* ══════════════════════════════════════════════════════════ */}
          <section style={{ marginBottom: "5rem" }}>
            {/* Section header */}
            <div style={{ marginBottom: "2.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
                <div style={{ width: "20px", height: "2px", background: "#FF6B35", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>
                  Chapter 02 — What We Offer
                </span>
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "0.04em", color: "#fff", lineHeight: 1 }}>
                Built for Readers
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {[
                { icon: "⚡", title: "Instant Access", description: "Start reading in seconds — no downloads or installations required. Just click and dive into the story.", num: "01" },
                { icon: "☁️", title: "Cloud Sync",    description: "Your reading progress is saved automatically and stays in sync across every device you own.", num: "02" },
                { icon: "📱", title: "Cross-Device",  description: "Read on your phone, tablet, or computer — seamlessly switch whenever and wherever you want.", num: "03" },
                { icon: "🔖", title: "Smart Bookmarks", description: "Save your favorite panels, chapters, and series with a single tap. Never lose your place again.", num: "04" },
                { icon: "🔍", title: "Powerful Search", description: "Find manga by genre, author, rating, or status. Discover your next obsession in seconds.", num: "05" },
                { icon: "🌙", title: "Always Free",   description: "No paywalls, no subscriptions. Ink Scratch is and always will be free for every reader.", num: "06" },
              ].map((card) => (
                <div key={card.title} className="about-feature-card" style={{
                  position: "relative",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "20px",
                  padding: "1.75rem",
                  overflow: "hidden",
                }}>
                  {/* Number watermark */}
                  <div style={{
                    position: "absolute", top: "-8px", right: "12px",
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "5rem", color: "rgba(255,255,255,0.03)",
                    lineHeight: 1, userSelect: "none", pointerEvents: "none", letterSpacing: "0.02em",
                  }}>
                    {card.num}
                  </div>
                  {/* Icon */}
                  <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{card.icon}</div>
                  {/* Title */}
                  <h3 style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.25rem", letterSpacing: "0.06em",
                    color: "#fff", marginBottom: "0.625rem", lineHeight: 1,
                  }}>
                    {card.title}
                  </h3>
                  {/* Description */}
                  <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.875rem", lineHeight: 1.7, fontWeight: 300 }}>
                    {card.description}
                  </p>
                  {/* Hover underline */}
                  <div className="card-underline" style={{
                    position: "absolute", bottom: 0, left: 0,
                    height: "2px", width: "0%",
                    background: "linear-gradient(90deg, #FF6B35, #E63946)",
                    transition: "width 0.6s ease",
                  }} />
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* STATS ROW                                                   */}
          {/* ══════════════════════════════════════════════════════════ */}
          <section style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            marginBottom: "5rem",
            padding: "2.5rem",
            background: "rgba(255,107,53,0.03)",
            border: "1px solid rgba(255,107,53,0.1)",
            borderRadius: "24px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(-55deg, transparent, transparent 40px, rgba(255,107,53,0.8) 40px, rgba(255,107,53,0.8) 41px)", pointerEvents: "none" }} />
            {[
              { value: "50,000+", label: "Manga Titles" },
              { value: "2.4M+",   label: "Chapters" },
              { value: "12,000+", label: "Active Readers" },
              { value: "99%",     label: "Uptime" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center", position: "relative" }}>
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2rem, 4vw, 2.75rem)",
                  letterSpacing: "0.03em", color: "#fff", lineHeight: 1,
                }}>
                  {s.value.replace(/[0-9,.]+/, match => match)}<span style={{ color: "#FF6B35" }}></span>
                  {/* Show value with orange suffix trick */}
                  <span style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(2rem, 4vw, 2.75rem)",
                    background: "linear-gradient(135deg, #fff, #FF6B35)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                  </span>
                </div>
                {/* Simpler approach — just render value with gradient */}
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2rem, 4vw, 2.75rem)",
                  letterSpacing: "0.03em", lineHeight: 1,
                  background: "linear-gradient(135deg, #fff 0%, #FF6B35 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  {s.value}
                </div>
                <div style={{ height: "clamp(2rem, 4vw, 2.75rem)", lineHeight: 1 }} />
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", fontFamily: "'Share Tech Mono', monospace", textTransform: "uppercase", letterSpacing: "0.2em", marginTop: "6px" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </section>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* FINAL CTA                                                   */}
          {/* ══════════════════════════════════════════════════════════ */}
          <section style={{
            position: "relative",
            textAlign: "center",
            padding: "4rem 2rem",
            borderRadius: "24px",
            border: "1px solid rgba(255,107,53,0.12)",
            background: "rgba(255,107,53,0.03)",
            overflow: "hidden",
          }}>
            {/* Diagonal bg */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 30px, rgba(255,107,53,0.8) 30px, rgba(255,107,53,0.8) 31px)", pointerEvents: "none" }} />
            {/* Ghost text */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", pointerEvents: "none" }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(80px, 18vw, 200px)", color: "transparent", WebkitTextStroke: "1px rgba(255,107,53,0.05)", lineHeight: 1, userSelect: "none", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                READ NOW
              </span>
            </div>

            <div style={{ position: "relative" }}>
              {/* Chapter divider */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "1.5rem" }}>
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,107,53,0.25))", maxWidth: "80px" }} />
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,107,53,0.5)" }}>Final Arc</span>
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(255,107,53,0.25), transparent)", maxWidth: "80px" }} />
              </div>

              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 7vw, 5rem)",
                letterSpacing: "0.04em", lineHeight: 0.95,
                marginBottom: "1rem",
              }}>
                <span style={{ color: "#fff" }}>Ready for Your</span><br />
                <span style={{ background: "linear-gradient(135deg, #FF6B35, #E63946)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Next Adventure?
                </span>
              </h2>

              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "1rem", marginBottom: "2.5rem", fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 300 }}>
                Join thousands of readers. Free forever. No credit card required.
              </p>

              <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
                <Link href="/register" style={{ textDecoration: "none" }}>
                  <button className="glow-btn" style={{
                    padding: "14px 36px",
                    background: "linear-gradient(135deg, #FF6B35, #E63946)",
                    border: "none", borderRadius: "14px", color: "#fff",
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.25rem", letterSpacing: "0.1em",
                    cursor: "pointer", position: "relative", overflow: "hidden",
                  }}>
                    Join Ink Scratch Free
                    <span style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderLeft: "16px solid transparent", borderTop: "16px solid rgba(255,255,255,0.15)" }} />
                  </button>
                </Link>
                <Link href="/" style={{ textDecoration: "none" }}>
                  <button style={{
                    padding: "14px 36px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: "14px", color: "rgba(255,255,255,0.6)",
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.25rem", letterSpacing: "0.1em",
                    cursor: "pointer",
                    transition: "all 0.25s",
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,107,53,0.3)";
                      (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.09)";
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.6)";
                    }}
                  >
                    Back to Home
                  </button>
                </Link>
              </div>
            </div>
          </section>

          {/* Footer spacing */}
          <div style={{ height: "3rem" }} />
        </div>
      </main>
    </>
  );
}