"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/app/(public)/_components/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
    if (!isLoading && isAuthenticated && !isAdmin) router.replace("/dashboard");
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center space-y-5">
          <span className="bg-linear-to-r from-orange via-red to-orange bg-clip-text text-transparent text-3xl font-black animate-pulse">
            Ink Scratch
          </span>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-orange rounded-full animate-bounce [animation-delay:0ms]" />
            <div className="w-2 h-2 bg-orange rounded-full animate-bounce [animation-delay:150ms]" />
            <div className="w-2 h-2 bg-red rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-[57px]">
        {children}
      </main>
    </div>
  );
}