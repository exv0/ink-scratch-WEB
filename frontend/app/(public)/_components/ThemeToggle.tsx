// app/(public)/_components/ThemeToggle.tsx
"use client";

import { useAuth, type Theme } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

interface ThemeToggleProps {
  /** compact = icon-only button (for header), full = shows label (for profile page) */
  variant?: "compact" | "full";
}

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: "light",
    label: "Light",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 6.106a.75.75 0 001.06 1.06l1.591-1.59a.75.75 0 00-1.06-1.061L6.166 6.106z" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    value: "system",
    label: "System",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5z" clipRule="evenodd" />
      </svg>
    ),
  },
];

// ── Compact (icon only — for Header) ─────────────────────────────────────────
function CompactToggle() {
  const { theme, setTheme } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-xl" style={{ background: "var(--bg-2)" }} />;
  }

  const current = themes.find(t => t.value === theme) ?? themes[2];
  const next = themes[(themes.indexOf(current) + 1) % themes.length];

  return (
    <button
      type="button"
      onClick={() => setTheme(next.value)}
      title={`Switch to ${next.label} mode`}
      aria-label={`Current: ${current.label} theme. Click to switch to ${next.label}`}
      style={{
        width: "2.25rem",
        height: "2.25rem",
        borderRadius: "0.625rem",
        border: "1px solid var(--border)",
        background: "var(--bg-2)",
        color: "var(--text-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s",
        flexShrink: 0,
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
      {current.icon}
    </button>
  );
}

// ── Full (segmented control — for Profile page) ───────────────────────────────
function FullToggle() {
  const { theme, setTheme } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div
      role="group"
      aria-label="Theme preference"
      style={{
        display: "inline-flex",
        background: "var(--bg-2)",
        border: "1px solid var(--border)",
        borderRadius: "0.75rem",
        padding: "0.25rem",
        gap: "0.25rem",
      }}
    >
      {themes.map((t) => {
        const active = theme === t.value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => setTheme(t.value)}
            aria-pressed={active}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.4375rem 0.75rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              fontSize: "0.8125rem",
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              transition: "all 0.2s",
              background: active
                ? "linear-gradient(135deg, var(--orange), var(--red))"
                : "transparent",
              color: active ? "#fff" : "var(--text-secondary)",
              boxShadow: active ? "0 2px 8px rgba(255,107,53,0.35)" : "none",
            }}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export default function ThemeToggle({ variant = "compact" }: ThemeToggleProps) {
  return variant === "full" ? <FullToggle /> : <CompactToggle />;
}