// app/(auth)/reset-password/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "@/lib/services/auth.service";

type Status = "loading" | "valid" | "invalid" | "success";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<Status>("loading");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) { setStatus("invalid"); return; }
    authService.verifyResetToken(token)
      .then(() => setStatus("valid"))
      .catch(() => setStatus("invalid"));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword({ token, password, confirmPassword });
      setStatus("success");
      setTimeout(() => router.push("/login"), 2500);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. The link may have expired.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "3rem 0" }}>
        <div style={{
          width: "2.5rem", height: "2.5rem", borderRadius: "50%",
          border: "3px solid var(--border)",
          borderTopColor: "var(--orange)",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 1rem",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "var(--text-muted)" }}>Verifying your link…</p>
      </div>
    );
  }

  // ── Invalid / expired token ────────────────────────────────────────────────
  if (status === "invalid") {
    return (
      <div className="fade-up" style={{ textAlign: "center" }}>
        <div style={{
          width: "4rem", height: "4rem", borderRadius: "50%",
          background: "rgba(230,57,70,0.1)",
          border: "2px solid rgba(230,57,70,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem",
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth={2} style={{ width: "1.75rem", height: "1.75rem" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "0.04em", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
          LINK EXPIRED
        </h1>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "2rem" }}>
          This password reset link is invalid or has expired. Reset links are only valid for 1 hour.
        </p>
        <Link href="/forgot-password">
          <button className="btn-primary">
            <span>Request a New Link</span>
          </button>
        </Link>
      </div>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="fade-up" style={{ textAlign: "center" }}>
        <div style={{
          width: "4rem", height: "4rem", borderRadius: "50%",
          background: "rgba(34,197,94,0.1)",
          border: "2px solid rgba(34,197,94,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem",
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth={2} style={{ width: "1.75rem", height: "1.75rem" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "0.04em", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
          PASSWORD RESET
        </h1>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "2rem" }}>
          Your password has been updated. Redirecting you to login…
        </p>
        <Link href="/login">
          <button className="btn-primary">
            <span>Go to Log In</span>
          </button>
        </Link>
      </div>
    );
  }

  // ── Reset form ─────────────────────────────────────────────────────────────
  return (
    <div className="fade-up">
      <div style={{ marginBottom: "2rem" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: "3rem", height: "3rem", borderRadius: "0.875rem",
          background: "var(--orange-dim)",
          border: "1px solid rgba(255,107,53,0.25)",
          marginBottom: "1.25rem",
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth={1.8} style={{ width: "1.5rem", height: "1.5rem" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
          </svg>
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "0.04em", color: "var(--text-primary)", lineHeight: 1, marginBottom: "0.5rem" }}>
          NEW PASSWORD
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
          Choose a strong password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {error && <div className="alert-error">{error}</div>}

        <div style={{ position: "relative" }}>
          <input
            type={showPass ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="New password"
            className="input-field"
            style={{ paddingRight: "3rem" }}
            autoFocus
          />
          <button type="button" onClick={() => setShowPass(v => !v)} style={{
            position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)",
            color: "var(--text-muted)", background: "transparent", border: "none", cursor: "pointer", padding: "0.25rem", display: "flex", alignItems: "center",
          }}>
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div style={{ position: "relative" }}>
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="input-field"
            style={{ paddingRight: "3rem" }}
          />
          <button type="button" onClick={() => setShowConfirm(v => !v)} style={{
            position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)",
            color: "var(--text-muted)", background: "transparent", border: "none", cursor: "pointer", padding: "0.25rem", display: "flex", alignItems: "center",
          }}>
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Strength hint */}
        {password.length > 0 && (
          <div style={{ display: "flex", gap: "0.375rem", alignItems: "center" }}>
            {[1, 2, 3, 4].map(level => (
              <div key={level} style={{
                flex: 1, height: "3px", borderRadius: "9999px",
                background: password.length >= level * 2
                  ? level <= 1 ? "var(--red)" : level <= 2 ? "var(--orange)" : level <= 3 ? "#facc15" : "#4ade80"
                  : "var(--border)",
                transition: "background 0.3s",
              }} />
            ))}
            <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap", marginLeft: "0.25rem" }}>
              {password.length < 6 ? "Too short" : password.length < 8 ? "Weak" : password.length < 12 ? "Good" : "Strong"}
            </span>
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="btn-primary">
          <span>{isSubmitting ? "Resetting…" : "Reset Password"}</span>
        </button>

        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
          <Link href="/login" style={{ color: "var(--orange)", fontWeight: 600, textDecoration: "none" }}>
            Back to Log In
          </Link>
        </p>
      </form>
    </div>
  );
}