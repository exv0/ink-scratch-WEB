// app/(auth)/reset-password/page.tsx - NEW FILE
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authService } from "@/lib/services/auth.service";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setMessage({ type: 'error', text: 'Invalid reset link' });
        setIsVerifying(false);
        return;
      }

      try {
        await authService.verifyResetToken(token);
        setIsValidToken(true);
      } catch (error: unknown) {
        setMessage({ type: 'error', text: (error as Error).message || 'Invalid or expired reset token' });
        setIsValidToken(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await authService.resetPassword({
        token: token!,
        password,
        confirmPassword,
      });

      setMessage({ type: 'success', text: result.message });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: unknown) {
      setMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto"></div>
          <p className="text-purple-300 mt-4">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h1>
          {message && (
            <p className="text-red-300 mb-6">{message.text}</p>
          )}
          <p className="text-purple-300 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link href="/forgot-password" className="text-orange font-medium hover:underline">
            Request a new reset link →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-8">
          <h1 className="logo-gradient mb-2">Set New Password</h1>
          <p className="text-text-secondary">
            Enter your new password below
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-purple-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="input-field"
              required
              disabled={isLoading}
              minLength={6}
            />
            <p className="text-xs text-purple-400 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-purple-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
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
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>

          <div className="text-center">
            <Link href="/login" className="text-orange font-medium hover:underline">
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="auth-container">
        <div className="auth-card text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto"></div>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}