"use client";

import { useState, useEffect, useCallback } from "react";
import { adminService } from "@/lib/services/admin.service";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface User {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  gender: "male" | "female" | "other";
  role: "user" | "admin";
  profilePicture?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-card rounded-2xl">
      <p className="text-[10px] font-black text-text-secondary tracking-widest uppercase mb-1">{label}</p>
      <p className="text-sm font-semibold text-text-primary">{value || "—"}</p>
    </div>
  );
}

export default function AdminUserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await adminService.getUserById(userId);
      setUser(result.data as User);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => { if (userId) fetchUser(); }, [fetchUser, userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <span className="bg-linear-to-r from-orange via-red to-orange bg-clip-text text-transparent text-2xl font-black animate-pulse">
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

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-divider p-10 max-w-md w-full text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h3 className="text-xl font-black text-text-primary mb-2">User not found</h3>
          <p className="text-text-secondary text-sm mb-6">{error}</p>
          <button
            onClick={() => router.push("/admin/users")}
            className="px-6 py-2.5 bg-linear-to-r from-orange to-red text-white font-black text-sm rounded-xl shadow-md shadow-orange/20 hover:scale-105 transition-all"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  const initials = user.fullName?.[0]?.toUpperCase() ?? "?";
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-gray-50 pb-16">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div className="relative bg-linear-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-red/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/40 font-semibold mb-6">
            <Link href="/dashboard" className="hover:text-white/70 transition-colors">Dashboard</Link>
            <span>›</span>
            <Link href="/admin/users" className="hover:text-white/70 transition-colors">Users</Link>
            <span>›</span>
            <span className="text-white/70">{user.fullName}</span>
          </nav>

          {/* User identity */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white/20 shrink-0">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-orange to-red flex items-center justify-center">
                    <span className="text-white text-2xl font-black">{initials}</span>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl font-black text-white">{user.fullName}</h1>
                  <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full tracking-widest uppercase ${
                    user.role === "admin"
                      ? "bg-linear-to-r from-orange to-red text-white"
                      : "bg-white/15 text-white/70"
                  }`}>
                    {user.role === "admin" ? "👑 " : "👤 "}{user.role}
                  </span>
                </div>
                <p className="text-white/50 text-sm font-semibold">@{user.username}</p>
                <p className="text-white/40 text-xs mt-0.5">{user.email}</p>
              </div>
            </div>

            <button
              onClick={() => router.push(`/admin/users/${userId}/edit`)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur border border-white/20 text-white font-black text-sm rounded-xl hover:bg-white/20 transition-all self-start sm:self-auto"
            >
              ✏️ Edit User
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* Back */}
        <button
          onClick={() => router.push("/admin/users")}
          className="flex items-center gap-1.5 text-sm font-bold text-text-secondary hover:text-orange transition-colors"
        >
          ← Back to Users
        </button>

        {/* Contact Info */}
        <div className="bg-white rounded-3xl border border-divider shadow-sm p-6">
          <p className="text-[10px] font-black text-text-secondary tracking-widest uppercase mb-4">Contact Information</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Email Address" value={user.email} />
            <Field label="Phone Number" value={user.phoneNumber} />
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white rounded-3xl border border-divider shadow-sm p-6">
          <p className="text-[10px] font-black text-text-secondary tracking-widest uppercase mb-4">Personal Information</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Full Name" value={user.fullName} />
            <Field label="Gender" value={user.gender} />
            <div className="p-4 bg-card rounded-2xl">
              <p className="text-[10px] font-black text-text-secondary tracking-widest uppercase mb-1">Account Status</p>
              <p className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
                Active
              </p>
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="bg-white rounded-3xl border border-divider shadow-sm p-6">
            <p className="text-[10px] font-black text-text-secondary tracking-widest uppercase mb-3">Bio</p>
            <p className="text-sm text-text-primary leading-relaxed">{user.bio}</p>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-3xl border border-divider shadow-sm p-6">
          <p className="text-[10px] font-black text-text-secondary tracking-widest uppercase mb-4">Account Timeline</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Created At" value={formatDate(user.createdAt)} />
            <Field label="Last Updated" value={formatDate(user.updatedAt)} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/admin/users/${userId}/edit`)}
            className="flex-1 py-3 bg-linear-to-r from-orange to-red text-white font-black text-sm rounded-2xl shadow-md shadow-orange/20 hover:shadow-orange/30 hover:scale-[1.01] transition-all duration-200"
          >
            ✏️ Edit User Profile
          </button>
          <button
            onClick={() => router.push("/admin/users")}
            className="flex-1 py-3 bg-white text-text-primary font-black text-sm rounded-2xl border border-divider hover:bg-card transition-colors"
          >
            ← Back to All Users
          </button>
        </div>
      </div>
    </div>
  );
}