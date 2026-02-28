// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "Ink Scratch",
    template: "%s · Ink Scratch",
  },
  description: "Thousands of manga, comics & novels — one portal, every device.",
  keywords: ["manga", "comics", "reader", "manhwa", "manhua", "ink scratch"],
  openGraph: {
    type: "website",
    siteName: "Ink Scratch",
    title: "Ink Scratch — Your Reading Journey Starts Here",
    description: "Thousands of manga, comics & novels — one portal, every device.",
  },
};

// ── Viewport ──────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  themeColor: "#FF6B35",
};

// ── Anti-flash theme script (runs synchronously before first paint) ───────────
// Reads the stored theme from localStorage and applies data-theme to <html>
// before React hydrates — eliminates FOUC entirely.
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('is-theme') || 'system';
    if (t === 'system') {
      t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', t);
  } catch(e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  document.documentElement.style.visibility = '';
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning prevents React from complaining about
    // data-theme being set by the inline script before hydration.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ── Google Fonts — Bebas Neue, Syne, JetBrains Mono ────────────── */}
        {/* These match the @import in globals.css; preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />

        {/* ── Theme script — runs before paint, prevents flash ─────────── */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>

      <body style={{ fontFamily: "var(--font-body)" }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}