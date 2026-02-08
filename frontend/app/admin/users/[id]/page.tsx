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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-purple-400 opacity-20"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-500/10 backdrop-blur-xl border border-red-500/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-red-400 text-2xl">⚠</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Error</h3>
              <p className="text-red-300">{error || 'User not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/admin/users')}
          className="group flex items-center gap-2 text-purple-300 hover:text-white mb-8 transition-all duration-300"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform text-xl">←</span>
          <span className="font-semibold">Back to Users</span>
        </button>

        {/* User Profile Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header Section with Gradient Background */}
          <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-8 md:p-12">
            {/* Decorative Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }}></div>
            </div>

            <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 flex-1">
                {/* Profile Picture */}
                <div className="relative group">
                  <div className="h-28 w-28 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/40 flex items-center justify-center overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-300">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl font-bold text-white">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center md:text-left">
                  <h1 className="text-4xl font-bold text-white mb-2">{user.fullName}</h1>
                  <p className="text-purple-100 text-lg mb-3">@{user.username}</p>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg ${
                    user.role === 'admin'
                      ? 'bg-pink-500/30 text-white border-2 border-white/50'
                      : 'bg-blue-500/30 text-white border-2 border-white/50'
                  }`}>
                    <span>{user.role === 'admin' ? '👑' : '👤'}</span>
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => router.push(`/admin/users/${userId}/edit`)}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-all transform hover:scale-105 border border-white/30 shadow-lg flex items-center gap-2"
              >
                <span>✏️</span>
                <span>Edit User</span>
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8 md:p-10 space-y-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-purple-400 text-xl">📧</span>
                </div>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5 hover:border-purple-400/50 transition-all">
                  <p className="text-purple-300 text-sm font-bold mb-2 uppercase tracking-wider">Email Address</p>
                  <p className="text-white text-lg font-semibold break-all">{user.email}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/30 rounded-xl p-5 hover:border-blue-400/50 transition-all">
                  <p className="text-blue-300 text-sm font-bold mb-2 uppercase tracking-wider">Phone Number</p>
                  <p className="text-white text-lg font-semibold">{user.phoneNumber}</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-pink-400 text-xl">👤</span>
                </div>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-sm border border-pink-500/30 rounded-xl p-5 hover:border-pink-400/50 transition-all">
                  <p className="text-pink-300 text-sm font-bold mb-2 uppercase tracking-wider">Gender</p>
                  <p className="text-white text-lg font-semibold capitalize">{user.gender}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/30 rounded-xl p-5 hover:border-green-400/50 transition-all">
                  <p className="text-green-300 text-sm font-bold mb-2 uppercase tracking-wider">Account Status</p>
                  <p className="text-white text-lg font-semibold flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Active
                  </p>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {user.bio && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <span className="text-blue-400 text-xl">✍️</span>
                  </div>
                  Bio
                </h2>
                <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all">
                  <p className="text-white text-lg leading-relaxed">{user.bio}</p>
                </div>
              </div>
            )}

            {/* Account Timeline */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-cyan-400 text-xl">📅</span>
                </div>
                Account Timeline
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-5 hover:border-cyan-400/50 transition-all">
                  <p className="text-cyan-300 text-sm font-bold mb-2 uppercase tracking-wider">Created At</p>
                  <p className="text-white text-lg font-semibold">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/30 rounded-xl p-5 hover:border-purple-400/50 transition-all">
                  <p className="text-purple-300 text-sm font-bold mb-2 uppercase tracking-wider">Last Updated</p>
                  <p className="text-white text-lg font-semibold">
                    {new Date(user.updatedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push(`/admin/users/${userId}/edit`)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
          >
            <span>✏️</span>
            <span>Edit User Profile</span>
          </button>
          <button
            onClick={() => router.push('/admin/users')}
            className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 text-white py-4 px-6 rounded-xl font-bold hover:from-slate-600 hover:to-slate-700 transition-all transform hover:scale-105 border border-purple-500/30 flex items-center justify-center gap-2"
          >
            <span>📋</span>
            <span>Back to All Users</span>
          </button>
        </div>
      </div>
    </div>
  );
}