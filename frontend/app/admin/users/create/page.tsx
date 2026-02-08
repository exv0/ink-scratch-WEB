// app/admin/users/create/page.tsx
"use client";

import { useState } from 'react';
import { adminService, CreateUserData } from '@/lib/services/admin.service';
import { useRouter } from 'next/navigation';

export default function AdminCreateUserPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    gender: 'male' as 'male' | 'female' | 'other',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'admin',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setIsSubmitting(false);
      return;
    }

    try {
      const createData: CreateUserData = { ...formData };
      if (profileImage) {
        createData.profileImage = profileImage;
      }

      await adminService.createUser(createData);
      setMessage({ type: 'success', text: 'User created successfully!' });
      
      setTimeout(() => {
        router.push('/admin/users');
      }, 1500);
    } catch (error: unknown) {
      setMessage({ type: 'error', text: (error as Error).message || 'Failed to create user' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/admin/users')}
          className="group flex items-center gap-2 text-purple-300 hover:text-white mb-8 transition-all duration-300"
        >
          <span className="transform group-hover:-translate-x-1 transition-transform text-xl">←</span>
          <span className="font-semibold">Back to Users</span>
        </button>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 md:p-10 shadow-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3">
              Create New User
            </h1>
            <p className="text-purple-300 text-lg">Add a new user to the system</p>
          </div>

          {/* Success/Error Message */}
          {message && (
            <div className={`mb-6 p-5 rounded-xl border-2 backdrop-blur-sm ${
              message.type === 'success'
                ? 'bg-green-500/10 border-green-500/50 text-green-300'
                : 'bg-red-500/10 border-red-500/50 text-red-300'
            }`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{message.type === 'success' ? '✓' : '⚠'}</span>
                <span className="font-medium">{message.text}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20 rounded-xl p-6">
              <label className="block text-sm font-bold text-purple-300 mb-4 uppercase tracking-wider">
                Profile Picture (Optional)
              </label>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Preview */}
                <div className="flex-shrink-0">
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-32 h-32 rounded-full object-cover shadow-xl"
                      />
                      <div className="absolute inset-0 rounded-full ring-4 ring-purple-400/50"></div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                      <span className="text-white text-5xl">📸</span>
                    </div>
                  )}
                </div>

                {/* Upload */}
                <div className="flex-1 w-full">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-purple-300
                      file:mr-4 file:py-3 file:px-6
                      file:rounded-xl file:border-0
                      file:text-sm file:font-bold
                      file:bg-gradient-to-r file:from-purple-600 file:to-blue-600
                      file:text-white
                      hover:file:from-purple-700 hover:file:to-blue-700
                      file:transition-all file:cursor-pointer file:shadow-lg"
                  />
                  <p className="mt-3 text-sm text-purple-400 flex items-center gap-2">
                    <span>💡</span>
                    <span>JPG, JPEG or PNG. Max size 5MB.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">👤</span>
                Personal Information
              </h3>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-bold text-purple-300 mb-2 uppercase tracking-wide">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/30 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Email & Username Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-purple-300 mb-2 uppercase tracking-wide">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/30 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="user@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-bold text-purple-300 mb-2 uppercase tracking-wide">
                    Username *
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/30 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="username"
                    required
                    minLength={3}
                    maxLength={30}
                  />
                </div>
              </div>

              {/* Phone & Gender Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-bold text-purple-300 mb-2 uppercase tracking-wide">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/30 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-bold text-purple-300 mb-2 uppercase tracking-wide">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'other' })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account Settings Section */}
            <div className="space-y-5 pt-6 border-t border-purple-500/20">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">⚙️</span>
                Account Settings
              </h3>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-bold text-purple-300 mb-2 uppercase tracking-wide">
                  Role *
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer"
                  required
                >
                  <option value="user">👤 User</option>
                  <option value="admin">👑 Admin</option>
                </select>
                <p className="mt-2 text-sm text-purple-400 flex items-center gap-2">
                  <span>ℹ️</span>
                  <span>Admins have full access to the admin panel</span>
                </p>
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-5 pt-6 border-t border-purple-500/20">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">🔒</span>
                Security
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-purple-300 mb-2 uppercase tracking-wide">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/30 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-bold text-purple-300 mb-2 uppercase tracking-wide">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/30 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <p className="text-sm text-purple-400 flex items-center gap-2">
                <span>🔐</span>
                <span>Password must be at least 6 characters long</span>
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Creating User...</span>
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    <span>Create User</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/admin/users')}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-slate-600 hover:to-slate-700 transition-all transform hover:scale-105 border border-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>✕</span>
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-purple-400 text-sm">
            Fields marked with <span className="text-pink-400 font-bold">*</span> are required
          </p>
        </div>
      </div>
    </div>
  );
}