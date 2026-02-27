// app/admin/layout.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/app/(public)/_components/Header";

// ── Admin-flavored branded loader ─────────────────────────────────────────────
function AdminLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {/* Logo mark */}
      <div style={{
        width: "3.5rem",
        height: "3.5rem",
        borderRadius: "1rem",
        background: "linear-gradient(135deg, var(--orange), var(--red))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 40px rgba(255,107,53,0.35)",
        animation: "pulse-glow 2s ease-in-out infinite",
      }}>
        {/* Shield icon for admin */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth={2.5}
          style={{ width: "1.375rem", height: "1.375rem" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      </div>

      {/* Wordmark */}
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.75rem",
        letterSpacing: "0.1em",
        background: "linear-gradient(135deg, var(--orange), var(--red))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>
        ADMIN PANEL
      </div>

      {/* Dot loader */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {[0, 150, 300].map((delay, i) => (
          <span
            key={i}
            style={{
              display: "block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: i === 2 ? "var(--red)" : "var(--orange)",
              animation: `bounce-dot 0.8s ease-in-out ${delay}ms infinite`,
            }}
          />
        ))}
      </div>

      {/* Label */}
      <p style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.625rem",
        letterSpacing: "0.25em",
        textTransform: "uppercase",
        color: "var(--text-muted)",
      }}>
        Verifying administrator access
      </p>
    </div>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
    if (!isLoading && isAuthenticated && !isAdmin) router.replace("/dashboard");
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading) return <AdminLoader />;
  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Header />
      {/*
        pt-[57px] offsets the fixed header:
          2.5px  — brand accent line
          54.5px — nav row
      */}
      <main style={{ paddingTop: "57px" }}>
        {children}
      </main>
    </div>
  );
}