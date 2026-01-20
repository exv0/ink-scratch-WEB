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

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();

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
      // Call backend API
      const result = await authService.login(data);

      // Store token and user data in cookies
      cookieUtils.setToken(result.token, rememberMe);
      cookieUtils.setUser(result.data, rememberMe);

      console.log("Login successful:", result);
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center">
        <h1 className="logo-gradient">Ink Scratch</h1>
        <p className="mt-3 text-text-secondary text-lg">
          Log in to continue your reading journey
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          className="input-field"
        />
        {errors.email && (
          <p className="text-sm text-red-600 -mt-2">{errors.email.message}</p>
        )}

        <div className="relative">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input-field pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition"
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600 -mt-2">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-orange border-divider rounded focus:ring-orange/50"
          />
          <span className="text-text-secondary">Remember me</span>
        </label>

        <Link
          href="/forgot-password"
          className="text-orange font-medium hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary"
      >
        {isSubmitting ? "Logging in..." : "Log In"}
      </button>

      <p className="text-center text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-orange font-bold hover:underline">
          Register now
        </Link>
      </p>
    </form>
  );
}