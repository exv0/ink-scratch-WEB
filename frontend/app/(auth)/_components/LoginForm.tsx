// app/(auth)/_components/LoginForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "@/lib/services/auth.service";
import { cookieUtils } from "@/lib/cookies";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const { refreshAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    try {
      const result = await authService.login(data);
      cookieUtils.setToken(result.token, rememberMe);
      cookieUtils.setUser(result.data, rememberMe);
      refreshAuth();
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <div style={{
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "0.75rem",
            background: "linear-gradient(135deg, var(--orange), var(--red))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-orange)",
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: "0.875rem", fontFamily: "var(--font-display)" }}>IS</span>
          </div>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.875rem",
            letterSpacing: "0.06em",
            background: "linear-gradient(135deg, var(--orange), var(--red))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            INK SCRATCH
          </span>
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "0.04em", color: "var(--text-primary)", lineHeight: 1, marginBottom: "0.5rem" }}>
          WELCOME BACK
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
          Continue your reading journey
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}

        {/* Email */}
        <div>
          <input
            {...register("email")}
            type="email"
            placeholder="Email address"
            className="input-field"
            style={{ fontFamily: "var(--font-body)" }}
          />
          {errors.email && (
            <p style={{ fontSize: "0.8125rem", color: "var(--red)", marginTop: "0.375rem", fontWeight: 500 }}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div style={{ position: "relative" }}>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input-field"
              style={{ paddingRight: "3rem", fontFamily: "var(--font-body)" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
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
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p style={{ fontSize: "0.8125rem", color: "var(--red)", marginTop: "0.375rem", fontWeight: 500 }}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember me + forgot password */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.875rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              style={{ width: "1rem", height: "1rem", accentColor: "var(--orange)", cursor: "pointer" }}
            />
            <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            style={{ color: "var(--orange)", fontWeight: 600, textDecoration: "none", transition: "opacity 0.15s" }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.75"}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
          >
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary">
          <span>{isSubmitting ? "Logging in..." : "Log In"}</span>
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
          Don't have an account?{" "}
          <Link
            href="/register"
            style={{ color: "var(--orange)", fontWeight: 700, textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline"}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none"}
          >
            Register now
          </Link>
        </p>
      </form>
    </div>
  );
}