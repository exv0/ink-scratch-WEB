"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/lib/services/user.service";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserProfilePage() {
  const { user, refreshAuth } = useAuth();
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "edit">("info");

  useEffect(() => {
    if (user) {
      setBio(user.bio || "");
      setPreviewUrl(user.profilePicture || null);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const updateData: { bio: string; profileImage?: File } = { bio };
      if (profileImage) updateData.profileImage = profileImage;

      const result = await userService.updateProfile(user._id, updateData);
      setMessage({ type: "success", text: "Profile updated successfully!" });

      const updatedUser = { ...user, ...result.data };
      document.cookie = `user_data=${JSON.stringify(updatedUser)}; path=/`;
      refreshAuth();

      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error: unknown) {
      setMessage({ type: "error", text: (error as Error).message || "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange/20 border-t-orange rounded-full animate-spin" />
      </div>
    );
  }

  const initials = (user.fullName || user.username || "?")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-16">
      <div className="max-w-3xl mx-auto px-4">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-6">
          <Link href="/dashboard" className="hover:text-orange transition-colors font-semibold">Dashboard</Link>
          <span>›</span>
          <span className="text-text-primary font-semibold">My Profile</span>
        </nav>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-divider overflow-hidden">

          {/* Banner */}
          <div className="relative h-32 bg-linear-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          </div>

          {/* Avatar + header info */}
          <div className="px-8 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-5">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-orange to-red flex items-center justify-center">
                      <span className="text-white text-2xl font-black">{initials}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Role badge */}
              <div className="mb-1">
                <span className={`inline-block text-xs font-black px-3 py-1 rounded-full tracking-widest uppercase ${
                  user.role === "admin"
                    ? "bg-linear-to-r from-orange to-red text-white"
                    : "bg-card text-text-secondary border border-divider"
                }`}>
                  {user.role}
                </span>
              </div>
            </div>

            <h1 className="text-2xl font-black text-text-primary">{user.fullName}</h1>
            <p className="text-text-secondary font-semibold text-sm mt-0.5">@{user.username}</p>
            {user.bio && (
              <p className="text-text-secondary text-sm mt-3 max-w-md leading-relaxed">{user.bio}</p>
            )}
          </div>

          {/* Tabs */}
          <div className="border-t border-divider flex">
            {(["info", "edit"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3.5 text-sm font-black tracking-wide transition-colors ${
                  activeTab === tab
                    ? "text-orange border-b-2 border-orange"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab === "info" ? "Account Info" : "Edit Profile"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">

            {/* Info Tab */}
            {activeTab === "info" && (
              <div className="space-y-4">
                {[
                  { label: "Full Name", value: user.fullName, icon: "👤" },
                  { label: "Username", value: `@${user.username}`, icon: "🏷️" },
                  { label: "Email", value: user.email, icon: "✉️" },
                  { label: "Phone", value: user.phoneNumber, icon: "📱" },
                  { label: "Gender", value: user.gender, icon: "⚧️" },
                ].map((field) => (
                  <div key={field.label} className="flex items-center gap-4 p-4 bg-card rounded-2xl">
                    <span className="text-xl w-8 text-center shrink-0">{field.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-text-secondary uppercase tracking-widest">{field.label}</p>
                      <p className="text-sm font-semibold text-text-primary mt-0.5 truncate">{field.value || "—"}</p>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => setActiveTab("edit")}
                  className="mt-4 w-full py-3 bg-linear-to-r from-orange to-red text-white font-black rounded-2xl shadow-md shadow-orange/20 hover:shadow-orange/30 hover:scale-[1.01] transition-all duration-200"
                >
                  Edit Profile
                </button>
              </div>
            )}

            {/* Edit Tab */}
            {activeTab === "edit" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                  <div className={`p-4 rounded-2xl text-sm font-semibold ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red/5 text-red border border-red/20"
                  }`}>
                    {message.type === "success" ? "✅" : "❌"} {message.text}
                  </div>
                )}

                {/* Profile Picture Upload */}
                <div>
                  <label className="block text-sm font-black text-text-primary mb-3 tracking-wide">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-divider shrink-0">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-orange to-red flex items-center justify-center">
                          <span className="text-white font-black text-xl">{initials}</span>
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer group">
                      <span className="block px-5 py-2.5 text-sm font-bold text-orange border-2 border-orange/30 rounded-xl hover:bg-orange/5 hover:border-orange/60 transition-all duration-200">
                        Upload Photo
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-text-secondary">JPG or PNG, max 5MB</p>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-black text-text-primary mb-2 tracking-wide">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={160}
                    rows={4}
                    className="w-full px-4 py-3 border border-divider rounded-2xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-orange/40 focus:border-transparent resize-none placeholder:text-text-secondary/50 transition-all"
                    placeholder="Tell readers about yourself..."
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-text-secondary">Share your reading vibe</p>
                    <p className={`text-xs font-semibold ${bio.length > 140 ? "text-red" : "text-text-secondary"}`}>
                      {bio.length}/160
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3 bg-linear-to-r from-orange to-red text-white font-black rounded-2xl shadow-md shadow-orange/20 hover:shadow-orange/30 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("info")}
                    className="flex-1 py-3 bg-card text-text-primary font-black rounded-2xl hover:bg-divider transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}