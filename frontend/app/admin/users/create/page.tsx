"use client";

import { useState } from "react";
import { adminService, CreateUserData } from "@/lib/services/admin.service";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Shared input class ───────────────────────────────────────────────────────
const inputCls = "w-full px-4 py-2.5 text-sm font-medium text-text-primary bg-card border border-divider rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange/40 transition-all placeholder:text-text-secondary/50";
const labelCls = "block text-[10px] font-black text-text-secondary tracking-widest uppercase mb-1.5";

export default function AdminCreateUserPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    gender: "male" as "male" | "female" | "other",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "user" as "user" | "admin",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const set = (field: string, value: string) => setFormData((p) => ({ ...p, [field]: value }));

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
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    setIsSubmitting(true);
    setMessage(null);
    try {
      const createData: CreateUserData = { ...formData };
      if (profileImage) createData.profileImage = profileImage;
      await adminService.createUser(createData);
      setMessage({ type: "success", text: "User created successfully!" });
      setTimeout(() => router.push("/admin/users"), 1500);
    } catch (error: unknown) {
      setMessage({ type: "error", text: (error as Error).message || "Failed to create user" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const initials = formData.fullName?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-gray-50 pb-16">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div className="relative bg-linear-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 py-10">
          <nav className="flex items-center gap-2 text-xs text-white/40 font-semibold mb-5">
            <Link href="/dashboard" className="hover:text-white/70 transition-colors">Dashboard</Link>
            <span>›</span>
            <Link href="/admin/users" className="hover:text-white/70 transition-colors">Users</Link>
            <span>›</span>
            <span className="text-white/70">Create</span>
          </nav>
          <p className="text-orange/80 text-xs font-black tracking-widest uppercase mb-1">Admin Panel</p>
          <h1 className="text-3xl font-black text-white mb-1">Create New User</h1>
          <p className="text-white/40 text-sm">Add a new user account to the system</p>
        </div>
      </div>

      {/* ── Form ──────────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Back */}
        <button
          onClick={() => router.push("/admin/users")}
          className="flex items-center gap-1.5 text-sm font-bold text-text-secondary hover:text-orange transition-colors mb-6"
        >
          ← Back to Users
        </button>

        <div className="bg-white rounded-3xl border border-divider shadow-sm overflow-hidden">

          {/* Alert */}
          {message && (
            <div className={`mx-6 mt-6 p-4 rounded-2xl text-sm font-semibold flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red/5 text-red border border-red/20"
            }`}>
              {message.type === "success" ? "✅" : "❌"} {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ── Profile Picture ─────────────────────────────────────────────── */}
            <section className="px-6 pt-6 pb-6 border-b border-divider">
              <p className="text-[10px] font-black text-text-secondary tracking-widest uppercase mb-4">Profile Picture</p>
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
                <label className="cursor-pointer">
                  <span className="block px-4 py-2 text-sm font-bold text-orange border-2 border-orange/30 rounded-xl hover:bg-orange/5 hover:border-orange/60 transition-all">
                    Upload Photo
                  </span>
                  <input type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleImageChange} className="hidden" />
                </label>
                <p className="text-xs text-text-secondary">JPG or PNG, max 5MB</p>
              </div>
            </section>

            {/* ── Personal Information ────────────────────────────────────────── */}
            <section className="px-6 py-6 border-b border-divider space-y-4">
              <p className="text-[10px] font-black text-text-secondary tracking-widest uppercase">Personal Information</p>

              <div>
                <label className={labelCls}>Full Name *</label>
                <input type="text" value={formData.fullName} onChange={(e) => set("fullName", e.target.value)} className={inputCls} placeholder="John Doe" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => set("email", e.target.value)} className={inputCls} placeholder="user@example.com" required />
                </div>
                <div>
                  <label className={labelCls}>Username *</label>
                  <input type="text" value={formData.username} onChange={(e) => set("username", e.target.value)} className={inputCls} placeholder="username" required minLength={3} maxLength={30} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Phone Number *</label>
                  <input type="tel" value={formData.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)} className={inputCls} placeholder="+1 (555) 000-0000" required />
                </div>
                <div>
                  <label className={labelCls}>Gender *</label>
                  <select value={formData.gender} onChange={(e) => set("gender", e.target.value)} className={inputCls} required>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </section>

            {/* ── Account Settings ────────────────────────────────────────────── */}
            <section className="px-6 py-6 border-b border-divider space-y-4">
              <p className="text-[10px] font-black text-text-secondary tracking-widest uppercase">Account Settings</p>
              <div>
                <label className={labelCls}>Role *</label>
                <select value={formData.role} onChange={(e) => set("role", e.target.value)} className={inputCls} required>
                  <option value="user">👤 User</option>
                  <option value="admin">👑 Admin</option>
                </select>
                <p className="text-xs text-text-secondary mt-1.5">Admins have full access to the admin panel</p>
              </div>
            </section>

            {/* ── Security ────────────────────────────────────────────────────── */}
            <section className="px-6 py-6 border-b border-divider space-y-4">
              <p className="text-[10px] font-black text-text-secondary tracking-widest uppercase">Security</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Password *</label>
                  <input type="password" value={formData.password} onChange={(e) => set("password", e.target.value)} className={inputCls} placeholder="••••••••" required minLength={6} />
                </div>
                <div>
                  <label className={labelCls}>Confirm Password *</label>
                  <input type="password" value={formData.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} className={inputCls} placeholder="••••••••" required minLength={6} />
                </div>
              </div>
              <p className="text-xs text-text-secondary">Password must be at least 6 characters</p>
            </section>

            {/* ── Actions ─────────────────────────────────────────────────────── */}
            <div className="px-6 py-5 flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-linear-to-r from-orange to-red text-white font-black text-sm rounded-2xl shadow-md shadow-orange/20 hover:shadow-orange/30 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating…
                  </>
                ) : "Create User"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/users")}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-card text-text-primary font-black text-sm rounded-2xl border border-divider hover:bg-divider transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-text-secondary mt-4">
          Fields marked with <span className="text-red font-black">*</span> are required
        </p>
      </div>
    </div>
  );
}