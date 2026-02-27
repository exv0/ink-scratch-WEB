// app/(auth)/_components/RegisterForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../schema";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth.service";
import { cookieUtils } from "@/lib/cookies";

// ── Helper: field wrapper with error ─────────────────────────────────────────
function Field({ children, error }: { children: React.ReactNode; error?: string }) {
  return (
    <div>
      {children}
      {error && (
        <p style={{ fontSize: "0.8125rem", color: "var(--red)", marginTop: "0.375rem", fontWeight: 500 }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ── Password visibility button ────────────────────────────────────────────────
function ToggleVis({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        position: "absolute",
        right: "0.75rem",
        top: "50%",
        transform: "translateY(-50%)",
        color: "var(--text-muted)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "0.25rem",
        display: "flex",
        alignItems: "center",
        transition: "color 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "var(--orange)"}
      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"}
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );
}

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError("");
    setSuccess("");
    try {
      const result = await authService.register(data);
      cookieUtils.setToken(result.token, true);
      cookieUtils.setUser(result.data, true);
      setSuccess("Account created! Redirecting to your dashboard…");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: unknown) {
      console.error("Registration error:", err);
      setError((err as Error).message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <div style={{
            width: "2.25rem",
            height: "2.25rem",
            borderRadius: "0.625rem",
            background: "linear-gradient(135deg, var(--orange), var(--red))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-orange)",
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: "0.75rem", fontFamily: "var(--font-display)" }}>IS</span>
          </div>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.625rem",
            letterSpacing: "0.06em",
            background: "linear-gradient(135deg, var(--orange), var(--red))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            INK SCRATCH
          </span>
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.875rem", letterSpacing: "0.04em", color: "var(--text-primary)", lineHeight: 1, marginBottom: "0.375rem" }}>
          CREATE ACCOUNT
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
          Join and start reading instantly
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}

        {/* Full Name */}
        <Field error={errors.fullName?.message}>
          <input {...register("fullName")} type="text" placeholder="Full Name" className="input-field" />
        </Field>

        {/* Phone + Gender row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <Field error={errors.phoneNumber?.message}>
            <input {...register("phoneNumber")} type="tel" placeholder="Phone Number" className="input-field" />
          </Field>
          <Field error={errors.gender?.message}>
            <select {...register("gender")} className="input-field" style={{ color: "var(--text-primary)" }}>
              <option value="" style={{ background: "var(--bg-card)" }}>Gender</option>
              <option value="male" style={{ background: "var(--bg-card)" }}>Male</option>
              <option value="female" style={{ background: "var(--bg-card)" }}>Female</option>
              <option value="other" style={{ background: "var(--bg-card)" }}>Other</option>
            </select>
          </Field>
        </div>

        {/* Username */}
        <Field error={errors.username?.message}>
          <input {...register("username")} type="text" placeholder="Username" className="input-field" />
        </Field>

        {/* Email */}
        <Field error={errors.email?.message}>
          <input {...register("email")} type="email" placeholder="Email address" className="input-field" />
        </Field>

        {/* Password */}
        <Field error={errors.password?.message}>
          <div style={{ position: "relative" }}>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input-field"
              style={{ paddingRight: "3rem" }}
            />
            <ToggleVis show={showPassword} onToggle={() => setShowPassword(v => !v)} />
          </div>
        </Field>

        {/* Confirm Password */}
        <Field error={errors.confirmPassword?.message}>
          <div style={{ position: "relative" }}>
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="input-field"
              style={{ paddingRight: "3rem" }}
            />
            <ToggleVis show={showConfirmPassword} onToggle={() => setShowConfirmPassword(v => !v)} />
          </div>
        </Field>

        <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ marginTop: "0.375rem" }}>
          <span>{isSubmitting ? "Creating Account…" : "Create Account"}</span>
        </button>

        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
          Already have an account?{" "}
          <Link
            href="/login"
            style={{ color: "var(--orange)", fontWeight: 700, textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline"}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none"}
          >
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}