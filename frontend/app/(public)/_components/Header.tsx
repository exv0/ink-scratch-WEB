// app/(public)/_components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  User: () => (
    <svg className="w-[15px] h-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Dashboard: () => (
    <svg className="w-[15px] h-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  Book: () => (
    <svg className="w-[15px] h-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-[15px] h-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-[15px] h-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  Info: () => (
    <svg className="w-[15px] h-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
  Help: () => (
    <svg className="w-[15px] h-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-[15px] h-[15px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  ),
};

// ─── NavLink ──────────────────────────────────────────────────────────────────
function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const active = mounted
    ? (href === "/" ? pathname === "/" : pathname.startsWith(href))
    : false;

  return (
    <Link href={href}>
      <span
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          padding: "0.4375rem 0.875rem",
          fontSize: "0.875rem",
          fontWeight: 700,
          borderRadius: "0.625rem",
          transition: "all 0.15s",
          color: active ? "var(--orange)" : "var(--text-secondary)",
          background: active ? "var(--orange-dim)" : "transparent",
          cursor: "pointer",
        }}
        onMouseEnter={e => {
          if (!active) {
            (e.currentTarget as HTMLSpanElement).style.color = "var(--orange)";
            (e.currentTarget as HTMLSpanElement).style.background = "var(--orange-dim)";
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            (e.currentTarget as HTMLSpanElement).style.color = "var(--text-secondary)";
            (e.currentTarget as HTMLSpanElement).style.background = "transparent";
          }
        }}
      >
        {label}
        {mounted && active && (
          <span
            style={{
              position: "absolute",
              bottom: "2px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "16px",
              height: "2px",
              background: "linear-gradient(to right, var(--orange), var(--red))",
              borderRadius: "9999px",
            }}
          />
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
    <Link href={href}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5625rem 0.75rem",
          borderRadius: "0.625rem",
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.background = highlight
            ? "rgba(255,107,53,0.08)"
            : "var(--bg-1)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.background = "transparent";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ color: highlight ? "var(--orange)" : "var(--text-muted)" }}>{icon}</span>
          <span style={{
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: highlight ? "var(--orange)" : "var(--text-primary)",
          }}>
            {label}
          </span>
        </div>
        {badge && (
          <span style={{
            fontSize: "0.5625rem",
            fontWeight: 900,
            background: "linear-gradient(135deg, var(--orange), var(--red))",
            color: "#fff",
            padding: "0.125rem 0.5rem",
            borderRadius: "9999px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}>
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
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.5625rem 0.75rem",
        borderRadius: "0.625rem",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.15s",
        color: danger ? "#f87171" : "var(--text-primary)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = danger
          ? "rgba(248, 113, 113, 0.08)"
          : "var(--bg-1)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      <span style={{ color: danger ? "#f87171" : "var(--text-muted)" }}>{icon}</span>
      <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{label}</span>
    </button>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.25rem 0.25rem" }}>
      <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      <span style={{
        fontSize: "0.5625rem",
        fontWeight: 900,
        color: "var(--text-muted)",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        fontFamily: "var(--font-mono)",
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
    </div>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isActive = (href: string) =>
    mounted ? (href === "/" ? pathname === "/" : pathname.startsWith(href)) : false;

  const initials = (user?.fullName || user?.username || "?")[0].toUpperCase();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    ...(mounted && isAuthenticated ? [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/manga", label: "Browse" },
    ] : []),
  ];

  const headerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    background: "var(--header-bg)",
    borderBottom: `1px solid var(--header-border)`,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: scrolled ? "var(--shadow-md)" : "none",
    transition: "box-shadow 0.3s ease",
  };

  return (
    <header style={headerStyle}>
      {/* Brand accent line */}
      <div style={{
        height: "2.5px",
        background: "linear-gradient(to right, var(--orange), var(--red), var(--orange))",
      }} />

      <div style={{
        maxWidth: "80rem",
        margin: "0 auto",
        padding: "0.625rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.5rem",
      }}>

        {/* ── Logo + nav ──────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <div style={{
              width: "1.75rem",
              height: "1.75rem",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, var(--orange), var(--red))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(255,107,53,0.35)",
              flexShrink: 0,
            }}>
              <span style={{ color: "#fff", fontSize: "0.6875rem", fontWeight: 900 }}>IS</span>
            </div>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.375rem",
              letterSpacing: "0.06em",
              background: "linear-gradient(135deg, var(--orange), var(--red))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              INK SCRATCH
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "0.125rem" }} className="hidden md:flex">
            {navLinks.map(link => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>
        </div>

        {/* ── Right side ───────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>

          {/* Theme toggle — always visible */}
          <ThemeToggle variant="compact" />

          {!mounted ? (
            <div style={{ width: "6rem", height: "2.25rem" }} />
          ) : !isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Link href="/login" className="hidden sm:block">
                <button style={{
                  padding: "0.5rem 1.125rem",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: "0.625rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--orange)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--orange)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                  }}
                >
                  Log In
                </button>
              </Link>
              <Link href="/register">
                <button style={{
                  padding: "0.5rem 1.125rem",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#fff",
                  background: "linear-gradient(135deg, var(--orange), var(--red))",
                  border: "none",
                  borderRadius: "0.625rem",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-orange)",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(255,107,53,0.45)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-orange)";
                  }}
                >
                  Sign Up Free
                </button>
              </Link>
            </div>
          ) : (
            /* Authenticated dropdown */
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(v => !v)}
                aria-label="Open user menu"
                aria-expanded={dropdownOpen}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  padding: "0.375rem 0.75rem 0.375rem 0.375rem",
                  borderRadius: "0.75rem",
                  border: `1px solid ${dropdownOpen ? "var(--border)" : "transparent"}`,
                  background: dropdownOpen ? "var(--bg-card)" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  if (!dropdownOpen) {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                  }
                }}
                onMouseLeave={e => {
                  if (!dropdownOpen) {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
                  }
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "0.625rem",
                  overflow: "hidden",
                  border: "2px solid rgba(255,107,53,0.25)",
                  flexShrink: 0,
                  position: "relative",
                }}>
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, var(--orange), var(--red))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <span style={{ color: "#fff", fontSize: "0.6875rem", fontWeight: 900 }}>{initials}</span>
                    </div>
                  )}
                  <span style={{
                    position: "absolute",
                    bottom: "-1px",
                    right: "-1px",
                    width: "8px",
                    height: "8px",
                    background: "#22c55e",
                    borderRadius: "50%",
                    border: "2px solid var(--bg)",
                  }} />
                </div>

                <div className="hidden sm:block" style={{ textAlign: "left" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 900, color: "var(--text-primary)", lineHeight: 1, maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user?.fullName || user?.username}
                  </p>
                  <p style={{ fontSize: "0.625rem", color: "var(--text-muted)", textTransform: "capitalize", marginTop: "2px", lineHeight: 1 }}>
                    {user?.role}
                  </p>
                </div>

                <svg
                  style={{
                    width: "0.875rem",
                    height: "0.875rem",
                    color: "var(--text-muted)",
                    transition: "transform 0.2s",
                    transform: dropdownOpen ? "rotate(180deg)" : "none",
                    flexShrink: 0,
                  }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* ── Dropdown ──────────────────────────────────────────── */}
              {dropdownOpen && (
                <div
                  className="slide-down"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 0.5rem)",
                    width: "16rem",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "1rem",
                    boxShadow: "var(--shadow-lg)",
                    overflow: "hidden",
                    zIndex: 50,
                  }}
                >
                  {/* Identity card */}
                  <div style={{
                    position: "relative",
                    padding: "1rem",
                    background: "linear-gradient(135deg, #1a1a2e, #0f3460)",
                    overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", top: "-24px", right: "-24px", width: "96px", height: "96px", background: "rgba(255,107,53,0.2)", borderRadius: "50%", filter: "blur(24px)", pointerEvents: "none" }} />
                    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.625rem", overflow: "hidden", border: "2px solid rgba(255,255,255,0.15)", flexShrink: 0 }}>
                        {user?.profilePicture ? (
                          <img src={user.profilePicture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--orange), var(--red))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ color: "#fff", fontWeight: 900, fontSize: "1.125rem" }}>{initials}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ color: "#fff", fontWeight: 900, fontSize: "0.875rem", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {user?.fullName || user?.username}
                        </p>
                        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.6875rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "2px" }}>
                          {user?.email}
                        </p>
                        {isAdmin && (
                          <span style={{
                            display: "inline-block",
                            marginTop: "0.375rem",
                            fontSize: "0.5625rem",
                            fontWeight: 900,
                            background: "linear-gradient(135deg, var(--orange), var(--red))",
                            color: "#fff",
                            padding: "0.125rem 0.5rem",
                            borderRadius: "9999px",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                          }}>
                            Administrator
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: "0.5rem" }}>
                    <p style={{ fontSize: "0.5625rem", fontWeight: 900, color: "var(--text-muted)", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-mono)", padding: "0.5rem 0.75rem 0.25rem" }}>
                      Account
                    </p>
                    <DDLink href="/user/profile"  icon={<Icons.User />}      label="My Profile" />
                    <DDLink href="/dashboard"     icon={<Icons.Dashboard />} label="Dashboard" />
                    <DDLink href="/dashboard"     icon={<Icons.Book />}      label="My Library" />

                    <SectionLabel label="Preferences" />
                    <DDLink href="/user/settings" icon={<Icons.Settings />}  label="Settings" />
                    {isAdmin && (
                      <DDLink href="/admin/users" icon={<Icons.Shield />} label="Admin Panel" badge="Admin" highlight />
                    )}

                    <SectionLabel label="Support" />
                    <DDLink href="/about" icon={<Icons.Info />} label="About Ink Scratch" />
                    <DDLink href="/help"  icon={<Icons.Help />} label="Help & Support" />

                    <div style={{ marginTop: "0.25rem", paddingTop: "0.375rem", borderTop: "1px solid var(--border)" }}>
                      <DDButton icon={<Icons.Logout />} label="Log Out" onClick={handleLogout} danger />
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ padding: "0.625rem 1rem", borderTop: "1px solid var(--border)", background: "var(--bg-1)" }}>
                    <p style={{ fontSize: "0.625rem", color: "var(--text-muted)", textAlign: "center", fontFamily: "var(--font-mono)" }}>
                      © 2025 Ink Scratch &nbsp;·&nbsp;
                      <Link href="/terms" style={{ color: "inherit", textDecoration: "none", transition: "color 0.15s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--orange)"}
                        onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"}
                      >Terms</Link>
                      &nbsp;·&nbsp;
                      <Link href="/privacy" style={{ color: "inherit", textDecoration: "none", transition: "color 0.15s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--orange)"}
                        onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"}
                      >Privacy</Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden"
            style={{
              padding: "0.5rem",
              borderRadius: "0.625rem",
              border: "1px solid transparent",
              background: "transparent",
              cursor: "pointer",
              transition: "all 0.15s",
              marginLeft: "0.25rem",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
            }}
            aria-label="Toggle menu"
          >
            <div style={{ width: "1.25rem", display: "flex", flexDirection: "column", gap: "5px" }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: "block",
                  height: "2px",
                  background: "var(--text-primary)",
                  borderRadius: "9999px",
                  transition: "all 0.3s",
                  transformOrigin: "center",
                  transform: mobileOpen
                    ? i === 0 ? "rotate(45deg) translateY(7px)"
                    : i === 1 ? "scaleX(0)"
                    : "rotate(-45deg) translateY(-7px)"
                    : "none",
                  opacity: mobileOpen && i === 1 ? 0 : 1,
                }} />
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ────────────────────────────────────────────────────── */}
      {mounted && mobileOpen && (
        <div
          className="md:hidden slide-down"
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--header-bg)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div style={{ padding: "0.75rem 1rem 0.5rem" }}>
            {navLinks.map(item => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div style={{
                    padding: "0.625rem 1rem",
                    borderRadius: "0.625rem",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: active ? "var(--orange)" : "var(--text-primary)",
                    background: active ? "var(--orange-dim)" : "transparent",
                    transition: "all 0.15s",
                    cursor: "pointer",
                  }}>
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>

          {isAuthenticated ? (
            <>
              <div style={{ margin: "0.5rem 1rem", padding: "0.75rem", background: "var(--bg-card)", borderRadius: "0.875rem", display: "flex", alignItems: "center", gap: "0.75rem", border: "1px solid var(--border)" }}>
                <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "0.625rem", overflow: "hidden", border: "2px solid rgba(255,107,53,0.25)", flexShrink: 0 }}>
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--orange), var(--red))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#fff", fontSize: "0.875rem", fontWeight: 900 }}>{initials}</span>
                    </div>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: 900, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user?.fullName || user?.username}
                  </p>
                  <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user?.email}
                  </p>
                </div>
              </div>

              <div style={{ padding: "0 1rem 1rem" }}>
                {[
                  { href: "/user/profile",  label: "My Profile" },
                  { href: "/user/settings", label: "Settings" },
                  { href: "/about",         label: "About Us" },
                  { href: "/help",          label: "Help & Support" },
                  ...(isAdmin ? [{ href: "/admin/users", label: "Admin Panel" }] : []),
                ].map(item => (
                  <Link key={item.href} href={item.href}>
                    <div style={{ padding: "0.625rem 1rem", borderRadius: "0.625rem", fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", cursor: "pointer", transition: "background 0.15s" }}>
                      {item.label}
                    </div>
                  </Link>
                ))}
                <div style={{ paddingTop: "0.375rem", borderTop: "1px solid var(--border)", marginTop: "0.375rem" }}>
                  <button onClick={handleLogout} style={{ width: "100%", textAlign: "left", padding: "0.625rem 1rem", borderRadius: "0.625rem", fontSize: "0.875rem", fontWeight: 700, color: "#f87171", background: "transparent", border: "none", cursor: "pointer", transition: "background 0.15s" }}>
                    Log Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: "0.5rem 1rem 1rem", display: "flex", gap: "0.75rem" }}>
              <Link href="/login" style={{ flex: 1 }}>
                <button style={{ width: "100%", padding: "0.625rem", border: "1px solid var(--border)", borderRadius: "0.625rem", fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", background: "transparent", cursor: "pointer" }}>
                  Log In
                </button>
              </Link>
              <Link href="/register" style={{ flex: 1 }}>
                <button style={{ width: "100%", padding: "0.625rem", background: "linear-gradient(135deg, var(--orange), var(--red))", color: "#fff", border: "none", borderRadius: "0.625rem", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer", boxShadow: "var(--shadow-orange)" }}>
                  Sign Up Free
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}