// app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { authService } from "@/lib/services/auth.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError("");
    setIsLoading(true);

    try {
      await authService.forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fade-up" style={{ textAlign: "center" }}>
        {/* Success icon */}
        <div style={{
          width: "4rem",
          height: "4rem",
          borderRadius: "50%",
          background: "rgba(34,197,94,0.1)",
          border: "2px solid rgba(34,197,94,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem",
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth={2} style={{ width: "1.75rem", height: "1.75rem" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "0.04em", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
          CHECK YOUR EMAIL
        </h1>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.5rem" }}>
          If <strong style={{ color: "var(--text-primary)" }}>{email}</strong> is registered, we've sent a password reset link.
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "2rem" }}>
          The link expires in 1 hour. Check your spam folder if you don't see it.
        </p>

        <Link href="/login">
          <button className="btn-primary">
            <span>Back to Log In</span>
          </button>
        </Link>

        <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          Didn't receive it?{" "}
          <button
            onClick={() => { setSubmitted(false); setEmail(""); }}
            style={{ color: "var(--orange)", fontWeight: 600, background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}
          >
            Try again
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "3rem",
          height: "3rem",
          borderRadius: "0.875rem",
          background: "var(--orange-dim)",
          border: "1px solid rgba(255,107,53,0.25)",
          marginBottom: "1.25rem",
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth={1.8} style={{ width: "1.5rem", height: "1.5rem" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "0.04em", color: "var(--text-primary)", lineHeight: 1, marginBottom: "0.5rem" }}>
          RESET PASSWORD
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.5 }}>
          Enter your email and we'll send a reset link if your account exists.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {error && <div className="alert-error">{error}</div>}

        <div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            className="input-field"
            required
            autoFocus
          />
        </div>

        <button type="submit" disabled={isLoading || !email.trim()} className="btn-primary">
          <span>{isLoading ? "Sending…" : "Send Reset Link"}</span>
        </button>

        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
          Remembered it?{" "}
          <Link
            href="/login"
            style={{ color: "var(--orange)", fontWeight: 700, textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline"}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none"}
          >
            Back to Log In
          </Link>
        </p>
      </form>
    </div>
  );
}