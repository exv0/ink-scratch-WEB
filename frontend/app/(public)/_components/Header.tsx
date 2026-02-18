"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";

// ─── Inline SVG Icons (no extra dependencies) ────────────────────────────────
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

// ─── Sub-components ───────────────────────────────────────────────────────────
function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 text-sm font-bold rounded-xl transition-all duration-150 ${
        active ? "text-orange bg-orange/10" : "text-text-primary hover:text-orange hover:bg-orange/5"
      }`}
    >
      {label}
      {active && (
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-linear-to-r from-orange to-red rounded-full" />
      )}
    </Link>
  );
}

/** A single row inside the dropdown */
function DDLink({
  href,
  icon,
  label,
  badge,
  highlight,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  highlight?: boolean;
}) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center justify-between px-3 py-[9px] rounded-xl transition-colors duration-150 group cursor-pointer ${
          highlight ? "hover:bg-orange/8" : "hover:bg-card"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`transition-colors ${highlight ? "text-orange" : "text-text-secondary group-hover:text-orange"}`}>
            {icon}
          </span>
          <span className={`text-[13px] font-semibold ${highlight ? "text-orange" : "text-text-primary"}`}>
            {label}
          </span>
        </div>
        {badge && (
          <span className="text-[9px] font-black bg-linear-to-r from-orange to-red text-white px-2 py-0.5 rounded-full tracking-widest uppercase">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}

function DDButton({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-[9px] rounded-xl transition-colors duration-150 text-left ${
        danger ? "hover:bg-red/5 text-red" : "hover:bg-card text-text-primary"
      }`}
    >
      <span className={danger ? "text-red" : "text-text-secondary"}>{icon}</span>
      <span className="text-[13px] font-semibold">{label}</span>
    </button>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-1 pt-2.5 pb-1">
      <div className="flex-1 h-px bg-divider" />
      <span className="text-[9px] font-black text-text-secondary/60 tracking-widest uppercase">{label}</span>
      <div className="flex-1 h-px bg-divider" />
    </div>
  );
}

// ─── Main Header ─────────────────────────────────────────────────────────────
export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const initials = (user?.fullName || user?.username || "?")[0].toUpperCase();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-divider shadow-sm">
      {/* Brand accent line */}
      <div className="h-[2px] bg-linear-to-r from-orange via-red to-orange" />

      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">

        {/* ── Logo + Desktop Nav ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group shrink-0">
            <span className="bg-linear-to-r from-orange via-red to-orange bg-clip-text text-transparent text-[22px] font-black tracking-tight group-hover:opacity-75 transition-opacity">
              Ink Scratch
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            <NavLink href="/" label="Home" active={isActive("/")} />
            <NavLink href="/about" label="About" active={isActive("/about")} />
            {isAuthenticated && (
              <>
                <NavLink href="/dashboard" label="Dashboard" active={isActive("/dashboard")} />
                <NavLink href="/manga" label="Browse" active={isActive("/manga")} />
              </>
            )}
          </nav>
        </div>

        {/* ── Right Side ─────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            /* Guest buttons */
            <>
              <Link href="/login" className="hidden sm:block">
                <button className="px-5 py-2 text-sm font-bold text-text-primary rounded-xl hover:bg-card transition-colors">
                  Log In
                </button>
              </Link>
              <Link href="/register">
                <button className="relative px-5 py-2 text-sm font-bold text-white bg-linear-to-r from-orange to-red rounded-xl shadow-md shadow-orange/20 hover:shadow-orange/35 hover:scale-105 transition-all duration-200 overflow-hidden group">
                  <span className="relative z-10">Sign Up Free</span>
                  <div className="absolute inset-0 bg-linear-to-r from-red to-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </Link>
            </>
          ) : (
            /* Authenticated: avatar + dropdown */
            <div className="relative" ref={dropdownRef}>
              {/* Trigger */}
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                aria-label="Open user menu"
                aria-expanded={dropdownOpen}
                className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl transition-all duration-150 ${
                  dropdownOpen ? "bg-card" : "hover:bg-card"
                }`}
              >
                {/* Avatar */}
                <div className="relative w-8 h-8 rounded-xl overflow-hidden border-2 border-orange/25 shrink-0">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-orange to-red flex items-center justify-center">
                      <span className="text-white text-[11px] font-black">{initials}</span>
                    </div>
                  )}
                  {/* Online indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                </div>

                {/* Name + role */}
                <div className="hidden sm:block text-left">
                  <p className="text-[12px] font-black text-text-primary leading-none max-w-[100px] truncate">
                    {user?.fullName || user?.username}
                  </p>
                  <p className="text-[10px] text-text-secondary capitalize mt-0.5 leading-none">{user?.role}</p>
                </div>

                {/* Chevron */}
                <svg
                  className={`w-3.5 h-3.5 text-text-secondary transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* ── Dropdown Panel ─────────────────────────────────────────── */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-divider shadow-2xl shadow-black/10 overflow-hidden z-50">

                  {/* Identity card (dark) */}
                  <div className="relative px-4 py-4 bg-linear-to-br from-[#1a1a2e] to-[#16213e] overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-orange/20 rounded-full blur-2xl" />
                    <div className="absolute -bottom-6 -left-4 w-20 h-20 bg-red/15 rounded-full blur-xl" />
                    <div className="relative flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white/20 shrink-0">
                        {user?.profilePicture ? (
                          <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-linear-to-br from-orange to-red flex items-center justify-center">
                            <span className="text-white font-black text-lg">{initials}</span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-black text-sm leading-tight truncate">{user?.fullName || user?.username}</p>
                        <p className="text-white/45 text-[11px] truncate mt-0.5">{user?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1.5 text-[9px] font-black bg-linear-to-r from-orange to-red text-white px-2 py-0.5 rounded-full tracking-widest uppercase">
                            Administrator
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu body */}
                  <div className="p-2">

                    {/* Account section */}
                    <p className="text-[9px] font-black text-text-secondary/50 tracking-widest uppercase px-3 pt-2 pb-1">
                      Account
                    </p>
                    <DDLink href="/user/profile" icon={<Icons.User />} label="My Profile" />
                    <DDLink href="/dashboard" icon={<Icons.Dashboard />} label="Dashboard" />
                    <DDLink href="/dashboard" icon={<Icons.Book />} label="My Library" />

                    {/* Preferences section */}
                    <SectionLabel label="Preferences" />
                    <DDLink href="/user/settings" icon={<Icons.Settings />} label="Settings" />
                    {isAdmin && (
                      <DDLink
                        href="/admin/users"
                        icon={<Icons.Shield />}
                        label="Admin Panel"
                        badge="Admin"
                        highlight
                      />
                    )}

                    {/* Support section */}
                    <SectionLabel label="Support" />
                    <DDLink href="/about" icon={<Icons.Info />} label="About Ink Scratch" />
                    <DDLink href="/help" icon={<Icons.Help />} label="Help & Support" />

                    {/* Logout */}
                    <div className="mt-1 pt-1.5 border-t border-divider">
                      <DDButton icon={<Icons.Logout />} label="Log Out" onClick={handleLogout} danger />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2 border-t border-divider bg-card">
                    <p className="text-[10px] text-text-secondary text-center">
                      © 2025 Ink Scratch &nbsp;·&nbsp;
                      <Link href="/terms" className="hover:text-orange transition-colors">Terms</Link>
                      &nbsp;·&nbsp;
                      <Link href="/privacy" className="hover:text-orange transition-colors">Privacy</Link>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-xl hover:bg-card transition-colors ml-1"
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-[5px]">
              <span className={`block h-[2px] bg-text-primary rounded-full transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block h-[2px] bg-text-primary rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block h-[2px] bg-text-primary rounded-full transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-divider bg-white">

          {/* Nav links */}
          <div className="px-4 pt-3 pb-2 space-y-0.5">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              ...(isAuthenticated ? [
                { href: "/dashboard", label: "Dashboard" },
                { href: "/manga", label: "Browse Manga" },
              ] : []),
            ].map((item) => {
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    active ? "text-orange bg-orange/10" : "text-text-primary hover:bg-card"
                  }`}>
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>

          {isAuthenticated ? (
            <>
              {/* User strip */}
              <div className="mx-4 my-2 p-3 bg-card rounded-2xl flex items-center gap-3 border border-divider">
                <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-divider shrink-0">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-orange to-red flex items-center justify-center">
                      <span className="text-white text-sm font-black">{initials}</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-text-primary truncate">{user?.fullName || user?.username}</p>
                  <p className="text-[11px] text-text-secondary truncate">{user?.email}</p>
                </div>
              </div>

              {/* Mobile action links */}
              <div className="px-4 pb-4 space-y-0.5">
                {[
                  { href: "/user/profile", label: "My Profile" },
                  { href: "/user/settings", label: "Settings" },
                  { href: "/about", label: "About Us" },
                  { href: "/help", label: "Help & Support" },
                  ...(isAdmin ? [{ href: "/admin/users", label: "Admin Panel" }] : []),
                ].map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div className="px-4 py-2.5 rounded-xl text-sm font-bold text-text-primary hover:bg-card transition-colors">
                      {item.label}
                    </div>
                  </Link>
                ))}
                <div className="pt-1.5 border-t border-divider mt-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold text-red hover:bg-red/5 transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="px-4 pb-4 pt-2 flex gap-3">
              <Link href="/login" className="flex-1">
                <button className="w-full py-2.5 border border-divider rounded-xl text-sm font-bold text-text-primary hover:bg-card transition-colors">
                  Log In
                </button>
              </Link>
              <Link href="/register" className="flex-1">
                <button className="w-full py-2.5 bg-linear-to-r from-orange to-red text-white rounded-xl text-sm font-bold shadow-md shadow-orange/20">
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