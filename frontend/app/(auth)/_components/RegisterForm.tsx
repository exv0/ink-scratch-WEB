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
      // Call backend API
      const result = await authService.register(data);

      // Store token and user data in cookies (always remember for registration)
      cookieUtils.setToken(result.token, true);
      cookieUtils.setUser(result.data, true);

      setSuccess("Account created successfully! Redirecting...");
      
      console.log("Registration successful:", result);

      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: unknown) {
      console.error("Registration error:", err);
      setError((err as Error).message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center">
        <h1 className="logo-gradient">Ink Scratch</h1>
        <p className="mt-3 text-text-secondary text-lg">
          Join and start reading instantly
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="space-y-4">
        <input
          {...register("fullName")}
          type="text"
          placeholder="Full Name"
          className="input-field"
        />
        {errors.fullName && (
          <p className="text-sm text-red-600 -mt-2">{errors.fullName.message}</p>
        )}

        <input
          {...register("phoneNumber")}
          type="tel"
          placeholder="Phone Number"
          className="input-field"
        />
        {errors.phoneNumber && (
          <p className="text-sm text-red-600 -mt-2">{errors.phoneNumber.message}</p>
        )}

        <select
          {...register("gender")}
          className="input-field"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-sm text-red-600 -mt-2">{errors.gender.message}</p>
        )}

        <input
          {...register("username")}
          type="text"
          placeholder="Username"
          className="input-field"
        />
        {errors.username && (
          <p className="text-sm text-red-600 -mt-2">{errors.username.message}</p>
        )}

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

        <div className="relative">
          <input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="input-field pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition"
          >
            {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600 -mt-2">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary"
      >
        {isSubmitting ? "Creating Account..." : "Register"}
      </button>

      <p className="text-center text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="text-orange font-bold hover:underline">
          Log In
        </Link>
      </p>
    </form>
  );
}