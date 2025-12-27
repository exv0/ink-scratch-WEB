// app/(auth)/forgot-password/page.tsx
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="auth-container">
      <div className="auth-card text-center">
        <h1 className="logo-gradient mb-6">Reset Password</h1>
        <p className="text-text-secondary mb-8">
          Enter your email and we'll send you a link to reset your password.
        </p>
        <input
          type="email"
          placeholder="Email"
          className="input-field mb-6"
        />
        <button className="btn-primary mb-6">
          Send Reset Link
        </button>
        <Link href="/login" className="text-orange font-medium hover:underline">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}