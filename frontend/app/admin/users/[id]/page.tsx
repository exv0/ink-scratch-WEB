// app/admin/users/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { adminService } from '@/lib/services/admin.service';
import { useRouter, useParams } from 'next/navigation';

interface User {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other';
  role: 'user' | 'admin';
  profilePicture?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
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

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [fetchUser, userId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
          <p className="text-red-300">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <button
        onClick={() => router.push('/admin/users')}
        className="text-purple-300 hover:text-white mb-8 flex items-center gap-2 transition-colors"
      >
        <span>←</span> Back to Users
      </button>

      {/* User Profile Card */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header Section */}
        <div className="bg-linear-to-r from-purple-600 to-pink-600 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{user.fullName}</h1>
                <p className="text-purple-100">@{user.username}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  user.role === 'admin'
                    ? 'bg-pink-500/30 text-white border border-white/30'
                    : 'bg-purple-500/30 text-white border border-white/30'
                }`}>
                  {user.role.toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={() => router.push(`/admin/users/${userId}/edit`)}
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all"
            >
              Edit User
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-purple-400">📧</span> Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-purple-300 text-sm font-medium mb-1">Email</p>
                <p className="text-white font-semibold">{user.email}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-purple-300 text-sm font-medium mb-1">Phone Number</p>
                <p className="text-white font-semibold">{user.phoneNumber}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-purple-400">👤</span> Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-purple-300 text-sm font-medium mb-1">Gender</p>
                <p className="text-white font-semibold capitalize">{user.gender}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-purple-300 text-sm font-medium mb-1">Account Status</p>
                <p className="text-white font-semibold">
                  <span className="text-green-400">●</span> Active
                </p>
              </div>
            </div>
          </div>

          {user.bio && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-purple-400">✍️</span> Bio
              </h2>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-white">{user.bio}</p>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-purple-400">📅</span> Account Timeline
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-purple-300 text-sm font-medium mb-1">Created At</p>
                <p className="text-white font-semibold">
                  {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-purple-300 text-sm font-medium mb-1">Last Updated</p>
                <p className="text-white font-semibold">
                  {new Date(user.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}