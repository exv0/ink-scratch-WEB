// app/(protected)/layout.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/app/(public)/_components/Header";

// ── Branded full-screen loading state ────────────────────────────────────────
function AuthLoader({ label = "Loading your library" }: { label?: string }) {
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
        <span style={{
          color: "#fff",
          fontSize: "1.25rem",
          fontWeight: 900,
          fontFamily: "var(--font-display)",
          letterSpacing: "0.05em",
        }}>
          IS
        </span>
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
        INK SCRATCH
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
        {label}
      </p>
    </div>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <AuthLoader />;
  if (!isAuthenticated) return null;

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