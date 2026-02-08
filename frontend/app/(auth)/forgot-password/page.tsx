// app/(auth)/forgot-password/page.tsx - UPDATED VERSION
"use client";

import { useState } from "react";
import Link from "next/link";
import { authService } from "@/lib/services/auth.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await authService.forgotPassword(email);
      setMessage({ type: 'success', text: result.message });
      setEmailSent(true);
    } catch (error: unknown) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-8">
          <h1 className="logo-gradient mb-2">Reset Password</h1>
          <p className="text-text-secondary">
            {emailSent 
              ? "Check your email for reset instructions"
              : "Enter your email and we'll send you a link to reset your password"}
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-900/20 border-green-500 text-green-300'
              : 'bg-red-900/20 border-red-500 text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field"
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center">
              <Link href="/login" className="text-orange font-medium hover:underline">
                ← Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 text-center">
              <div className="text-5xl mb-4">📧</div>
              <p className="text-white mb-2">Email sent successfully!</p>
              <p className="text-purple-300 text-sm">
                Check your inbox and click the reset link to continue.
              </p>
              <p className="text-purple-400 text-xs mt-4">
                Didn't receive it? Check your spam folder or{" "}
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setMessage(null);
                  }}
                  className="text-orange hover:underline"
                >
                  try again
                </button>
              </p>
            </div>

            <div className="text-center">
              <Link href="/login" className="text-orange font-medium hover:underline">
                ← Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}