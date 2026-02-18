"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/app/(public)/_components/Header";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Full-screen branded loader while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center space-y-5">
          {/* Animated logo */}
          <div className="relative inline-block">
            <span className="bg-linear-to-r from-orange via-red to-orange bg-clip-text text-transparent text-3xl font-black tracking-tight animate-pulse">
              Ink Scratch
            </span>
          </div>
          {/* Spinner */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-orange rounded-full animate-bounce [animation-delay:0ms]" />
            <div className="w-2 h-2 bg-orange rounded-full animate-bounce [animation-delay:150ms]" />
            <div className="w-2 h-2 bg-red rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
          <p className="text-white/30 text-xs font-semibold tracking-widest uppercase">
            Loading your library
          </p>
        </div>
      </div>
    );
  }

  // Don't flash content while redirecting
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* pt-[57px] = header height (2px accent + ~55px nav) */}
      <main className="pt-[57px]">
        {children}
      </main>
    </div>
  );
}