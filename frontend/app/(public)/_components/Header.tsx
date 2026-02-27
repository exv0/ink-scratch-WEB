// app/(public)/_components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  User: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Dashboard: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  Book: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  Shield: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  Logout: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  ),
};

// ─── NavLink ──────────────────────────────────────────────────────────────────
function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const active = mounted ? (href === "/" ? pathname === "/" : pathname.startsWith(href)) : false;

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <span
        style={{
          position: "relative", display: "inline-flex", alignItems: "center",
          padding: "6px 14px", fontFamily: "'Share Tech Mono', monospace",
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
          borderRadius: "10px", cursor: "pointer", transition: "all 0.2s",
          color: active ? "#FF6B35" : "rgba(255,255,255,0.45)",
          background: active ? "rgba(255,107,53,0.08)" : "transparent",
          border: active ? "1px solid rgba(255,107,53,0.2)" : "1px solid transparent",
        }}
        onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLSpanElement).style.color = "rgba(255,255,255,0.85)"; (e.currentTarget as HTMLSpanElement).style.background = "rgba(255,255,255,0.04)"; } }}
        onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLSpanElement).style.color = "rgba(255,255,255,0.45)"; (e.currentTarget as HTMLSpanElement).style.background = "transparent"; } }}
      >
        {label}
        {mounted && active && (
          <span style={{ position: "absolute", bottom: "3px", left: "50%", transform: "translateX(-50%)", width: "14px", height: "2px", background: "linear-gradient(90deg, #FF6B35, #E63946)", borderRadius: "9999px" }} />
        )}
      </span>
    </Link>
  );
}

// ─── Dropdown helpers ─────────────────────────────────────────────────────────
function DDLink({ href, icon, label, badge, highlight }: {
  href: string; icon: React.ReactNode; label: string; badge?: string; highlight?: boolean;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: "10px", cursor: "pointer", transition: "background 0.15s" }}
        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = highlight ? "rgba(255,107,53,0.08)" : "rgba(255,255,255,0.04)"}
        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: highlight ? "#FF6B35" : "rgba(255,255,255,0.3)" }}>{icon}</span>
          <span style={{ fontSize: "12px", fontWeight: 600, fontFamily: "'Noto Sans JP', sans-serif", color: highlight ? "#FF6B35" : "rgba(255,255,255,0.75)" }}>{label}</span>
        </div>
        {badge && (
          <span style={{ fontSize: "9px", fontWeight: 900, background: "linear-gradient(135deg, #FF6B35, #E63946)", color: "#fff", padding: "2px 8px", borderRadius: "9999px", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'Share Tech Mono', monospace" }}>
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}

function DDButton({ icon, label, onClick, danger }: {
  icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "10px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left", transition: "background 0.15s", color: danger ? "#f87171" : "rgba(255,255,255,0.75)" }}
      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = danger ? "rgba(248,113,113,0.08)" : "rgba(255,255,255,0.04)"}
      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
    >
      <span style={{ color: danger ? "#f87171" : "rgba(255,255,255,0.3)" }}>{icon}</span>
      <span style={{ fontSize: "12px", fontWeight: 600, fontFamily: "'Noto Sans JP', sans-serif" }}>{label}</span>
    </button>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────
export default function Header() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [mounted,      setMounted]      = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // ✅ Redirects to /login after logout
  const handleLogout = () => { logout(); router.push("/login"); };

  const isActive = (href: string) =>
    mounted ? (href === "/" ? pathname === "/" : pathname.startsWith(href)) : false;

  const initials = (user?.fullName || user?.username || "?")[0].toUpperCase();

  // ✅ Library added to desktop nav
  const navLinks = [
    { href: "/",         label: "Home"      },
    { href: "/about",    label: "About"     },
    ...(mounted && isAuthenticated ? [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/manga",     label: "Browse"    },
      { href: "/library",   label: "Library"   },
    ] : []),
  ];

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@400;500;700;900&family=Share+Tech+Mono&display=swap');
        @keyframes dropdown-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dropdown-in { animation: dropdown-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes mobile-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-in { animation: mobile-in 0.22s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>

      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? "rgba(10,10,15,0.92)" : "rgba(10,10,15,0.75)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: `1px solid ${scrolled ? "rgba(255,107,53,0.12)" : "rgba(255,255,255,0.05)"}`,
        boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.4)" : "none",
        transition: "all 0.3s ease",
      }}>

        {/* Top orange accent line */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, transparent 0%, #FF6B35 30%, #E63946 60%, transparent 100%)", opacity: 0.8 }} />

        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem" }}>

          {/* ── Left: Logo + Nav ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "linear-gradient(135deg, #FF6B35, #E63946)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 14px rgba(255,107,53,0.45)", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: "11px", fontWeight: 900, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}>IS</span>
              </div>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.375rem", letterSpacing: "0.08em", background: "linear-gradient(135deg, #FF6B35, #E63946)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                INK SCRATCH
              </span>
            </Link>

            <nav style={{ display: "flex", alignItems: "center", gap: "2px" }} className="hidden md:flex">
              {navLinks.map(link => <NavLink key={link.href} href={link.href} label={link.label} />)}
            </nav>
          </div>

          {/* ── Right: Auth ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {!mounted ? (
              <div style={{ width: "96px", height: "36px" }} />
            ) : !isAuthenticated ? (
              <>
                <Link href="/login" className="hidden sm:block" style={{ textDecoration: "none" }}>
                  <button
                    style={{ padding: "7px 18px", fontFamily: "'Share Tech Mono', monospace", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,107,53,0.4)"; (e.currentTarget as HTMLButtonElement).style.color = "#FF6B35"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)"; }}
                  >Log In</button>
                </Link>
                <Link href="/register" style={{ textDecoration: "none" }}>
                  <button
                    style={{ padding: "7px 18px", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em", color: "#fff", background: "linear-gradient(135deg, #FF6B35, #E63946)", border: "none", borderRadius: "10px", cursor: "pointer", boxShadow: "0 0 18px rgba(255,107,53,0.35)", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 30px rgba(255,107,53,0.55)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 18px rgba(255,107,53,0.35)"; }}
                  >
                    Sign Up Free
                    <span style={{ position: "absolute", top: 0, right: 0, width: 0, height: 0, borderLeft: "12px solid transparent", borderTop: "12px solid rgba(255,255,255,0.15)" }} />
                  </button>
                </Link>
              </>
            ) : (
              /* ── Authenticated dropdown ── */
              <div style={{ position: "relative" }} ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  aria-label="Open user menu"
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 10px 5px 5px", borderRadius: "12px", border: `1px solid ${dropdownOpen ? "rgba(255,107,53,0.25)" : "rgba(255,255,255,0.07)"}`, background: dropdownOpen ? "rgba(255,107,53,0.05)" : "rgba(255,255,255,0.03)", cursor: "pointer", transition: "all 0.2s" }}
                  onMouseEnter={e => { if (!dropdownOpen) { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"; } }}
                  onMouseLeave={e => { if (!dropdownOpen) { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)"; } }}
                >
                  {/* Avatar */}
                  <div style={{ width: "30px", height: "30px", borderRadius: "8px", overflow: "hidden", border: "1.5px solid rgba(255,107,53,0.3)", flexShrink: 0, position: "relative" }}>
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #FF6B35, #E63946)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#fff", fontSize: "11px", fontWeight: 900, fontFamily: "'Bebas Neue', sans-serif" }}>{initials}</span>
                      </div>
                    )}
                    <span style={{ position: "absolute", bottom: "-1px", right: "-1px", width: "8px", height: "8px", background: "#22c55e", borderRadius: "50%", border: "2px solid #0a0a0f" }} />
                  </div>

                  {/* Name */}
                  <div className="hidden sm:block" style={{ textAlign: "left" }}>
                    <p style={{ fontSize: "12px", fontWeight: 900, color: "rgba(255,255,255,0.85)", fontFamily: "'Noto Sans JP', sans-serif", lineHeight: 1, maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user?.fullName || user?.username}
                    </p>
                    <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", marginTop: "2px", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.1em", textTransform: "capitalize" }}>
                      {user?.role}
                    </p>
                  </div>

                  {/* Chevron */}
                  <svg style={{ width: "12px", height: "12px", color: "rgba(255,255,255,0.3)", flexShrink: 0, transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "none" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* ── Dropdown panel ── */}
                {dropdownOpen && (
                  <div className="dropdown-in" style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: "260px", background: "rgba(14,14,20,0.97)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,107,53,0.06)", overflow: "hidden", zIndex: 50, backdropFilter: "blur(20px)" }}>

                    {/* Identity card */}
                    <div style={{ position: "relative", padding: "16px", background: "linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(230,57,70,0.05) 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
                      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, #FF6B35 1px, transparent 1px)", backgroundSize: "18px 18px", pointerEvents: "none" }} />
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px", position: "relative" }}>
                        <div style={{ width: "16px", height: "1.5px", background: "#FF6B35", flexShrink: 0 }} />
                        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>User Profile</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, border: "1.5px solid rgba(255,107,53,0.25)" }}>
                          {user?.profilePicture ? (
                            <img src={user.profilePicture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #FF6B35, #E63946)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ color: "#fff", fontWeight: 900, fontSize: "18px", fontFamily: "'Bebas Neue', sans-serif" }}>{initials}</span>
                            </div>
                          )}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ color: "#fff", fontWeight: 900, fontFamily: "'Noto Sans JP', sans-serif", fontSize: "13px", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {user?.fullName || user?.username}
                          </p>
                          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", fontFamily: "'Share Tech Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "2px" }}>
                            {user?.email}
                          </p>
                          {isAdmin && (
                            <span style={{ display: "inline-block", marginTop: "5px", fontSize: "9px", fontWeight: 900, background: "linear-gradient(135deg, #FF6B35, #E63946)", color: "#fff", padding: "2px 8px", borderRadius: "9999px", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'Share Tech Mono', monospace" }}>
                              Administrator
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ✅ Menu — Settings, Help & Support, About all removed */}
                    <div style={{ padding: "8px" }}>
                      <div style={{ padding: "4px 10px 2px" }}>
                        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>Account</span>
                      </div>
                      <DDLink href="/user/profile" icon={<Icons.User />}      label="My Profile" />
                      <DDLink href="/dashboard"    icon={<Icons.Dashboard />} label="Dashboard"  />
                      <DDLink href="/library"      icon={<Icons.Book />}      label="My Library" />
                      {isAdmin && (
                        <DDLink href="/admin/users" icon={<Icons.Shield />} label="Admin Panel" badge="Admin" highlight />
                      )}
                      <div style={{ marginTop: "4px", paddingTop: "6px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <DDButton icon={<Icons.Logout />} label="Log Out" onClick={handleLogout} danger />
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{ padding: "8px 16px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}>
                      <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.15)", textAlign: "center", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.1em" }}>
                        © 2025 INK SCRATCH &nbsp;·&nbsp;
                        <Link href="/terms" style={{ color: "inherit", textDecoration: "none" }}
                          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#FF6B35"}
                          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.15)"}
                        >Terms</Link>
                        &nbsp;·&nbsp;
                        <Link href="/privacy" style={{ color: "inherit", textDecoration: "none" }}
                          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#FF6B35"}
                          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.15)"}
                        >Privacy</Link>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Mobile hamburger ── */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden"
              style={{ padding: "8px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", background: mobileOpen ? "rgba(255,107,53,0.08)" : "rgba(255,255,255,0.03)", cursor: "pointer", transition: "all 0.2s", marginLeft: "4px" }}
              aria-label="Toggle menu"
            >
              <div style={{ width: "18px", display: "flex", flexDirection: "column", gap: "4px" }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ display: "block", height: "1.5px", background: mobileOpen ? "#FF6B35" : "rgba(255,255,255,0.6)", borderRadius: "9999px", transition: "all 0.3s", transformOrigin: "center", transform: mobileOpen ? i === 0 ? "rotate(45deg) translateY(5.5px)" : i === 1 ? "scaleX(0)" : "rotate(-45deg) translateY(-5.5px)" : "none", opacity: mobileOpen && i === 1 ? 0 : 1 }} />
                ))}
              </div>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mounted && mobileOpen && (
          <div className="mobile-in md:hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,15,0.97)", backdropFilter: "blur(20px)" }}>
            <div style={{ padding: "10px 12px 6px" }}>
              {navLinks.map(item => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                    <div style={{ padding: "10px 14px", borderRadius: "10px", fontFamily: "'Share Tech Mono', monospace", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: active ? "#FF6B35" : "rgba(255,255,255,0.55)", background: active ? "rgba(255,107,53,0.08)" : "transparent", border: active ? "1px solid rgba(255,107,53,0.15)" : "1px solid transparent", cursor: "pointer", transition: "all 0.15s", marginBottom: "2px" }}>
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </div>

            {isAuthenticated ? (
              <>
                {/* Mobile user card */}
                <div style={{ margin: "4px 12px 8px", padding: "12px", background: "rgba(255,107,53,0.05)", border: "1px solid rgba(255,107,53,0.12)", borderRadius: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", overflow: "hidden", border: "1.5px solid rgba(255,107,53,0.25)", flexShrink: 0 }}>
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #FF6B35, #E63946)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#fff", fontSize: "14px", fontWeight: 900, fontFamily: "'Bebas Neue', sans-serif" }}>{initials}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 900, color: "#fff", fontFamily: "'Noto Sans JP', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.fullName || user?.username}</p>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "'Share Tech Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
                  </div>
                </div>

                {/* ✅ Mobile links — Settings, Help & About removed, Library added */}
                <div style={{ padding: "0 12px 12px" }}>
                  {[
                    { href: "/user/profile", label: "My Profile" },
                    { href: "/library",      label: "My Library" },
                    ...(isAdmin ? [{ href: "/admin/users", label: "Admin Panel" }] : []),
                  ].map(item => (
                    <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                      <div style={{ padding: "9px 14px", borderRadius: "10px", cursor: "pointer", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.6)", fontFamily: "'Noto Sans JP', sans-serif", transition: "background 0.15s", marginBottom: "1px" }}>
                        {item.label}
                      </div>
                    </Link>
                  ))}
                  <div style={{ paddingTop: "6px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "4px" }}>
                    <button onClick={handleLogout} style={{ width: "100%", textAlign: "left", padding: "9px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: 600, color: "#f87171", background: "transparent", border: "none", cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif" }}>
                      Log Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ padding: "6px 12px 12px", display: "flex", gap: "8px" }}>
                <Link href="/login" style={{ flex: 1, textDecoration: "none" }}>
                  <button style={{ width: "100%", padding: "10px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontFamily: "'Share Tech Mono', monospace", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", background: "transparent", cursor: "pointer" }}>Log In</button>
                </Link>
                <Link href="/register" style={{ flex: 1, textDecoration: "none" }}>
                  <button style={{ width: "100%", padding: "10px", background: "linear-gradient(135deg, #FF6B35, #E63946)", border: "none", borderRadius: "10px", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.08em", color: "#fff", cursor: "pointer", boxShadow: "0 0 18px rgba(255,107,53,0.3)" }}>Sign Up Free</button>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}