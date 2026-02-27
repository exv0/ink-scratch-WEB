"use client";

import { useState } from "react";
import { adminService, CreateUserData } from "@/lib/services/admin.service";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminCreateUserPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "", phoneNumber: "",
    gender: "male" as "male" | "female" | "other",
    email: "", username: "", password: "", confirmPassword: "",
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@300;400;500;700;900&family=Share+Tech+Mono&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ink-float {
          0%   { opacity: 0; transform: translateY(0) scale(0.5); }
          15%  { opacity: 0.7; }
          85%  { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-600px) scale(1.5) rotate(180deg); }
        }
        .ink-float { animation: ink-float linear infinite; }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both; }

        .form-input { width: 100%; padding: 11px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: rgba(255,255,255,0.85); font-family: 'Noto Sans JP', sans-serif; font-size: 0.875rem; outline: none; transition: border-color 0.2s, background 0.2s; box-sizing: border-box; }
        .form-input::placeholder { color: rgba(255,255,255,0.2); }
        .form-input:focus { border-color: rgba(255,107,53,0.4); background: rgba(255,107,53,0.03); box-shadow: 0 0 0 3px rgba(255,107,53,0.07); }
        .form-input option { background: #16161f; }

        .primary-btn { transition: all 0.25s; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .primary-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 30px rgba(255,107,53,0.45) !important; }
        .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .cancel-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.2s; }
        .cancel-btn:hover:not(:disabled) { border-color: rgba(255,255,255,0.2); color: #fff; background: rgba(255,255,255,0.07); }
        .cancel-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .upload-label { display: inline-block; padding: 8px 18px; border: 1px solid rgba(255,107,53,0.35); border-radius: 10px; color: #FF6B35; font-family: 'Share Tech Mono', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .upload-label:hover { background: rgba(255,107,53,0.08); border-color: rgba(255,107,53,0.6); }

        .back-btn { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.35); font-family: 'Share Tech Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; transition: color 0.2s; display: flex; align-items: center; gap: 6px; padding: 0; }
        .back-btn:hover { color: #FF6B35; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: rgba(255,107,53,0.35); border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Noto Sans JP', sans-serif", paddingBottom: "5rem" }}>

        {/* Fixed background */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-10%", left: "20%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.2) 0%, transparent 70%)", filter: "blur(90px)", opacity: 0.15 }} />
          <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(230,57,70,0.3) 0%, transparent 70%)", filter: "blur(80px)", opacity: 0.1 }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "radial-gradient(circle, #FF6B35 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)" }} />
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="ink-float" style={{ position: "absolute", left: `${(i * 53 + 7) % 92}%`, bottom: -10, width: 3 + (i % 4) * 2, height: 3 + (i % 4) * 2, borderRadius: "50%", background: i % 2 === 0 ? "radial-gradient(circle, rgba(255,107,53,0.5), transparent)" : "radial-gradient(circle, rgba(230,57,70,0.4), transparent)", animationDelay: `${i * 1.1}s`, animationDuration: `${8 + (i % 4)}s`, filter: "blur(1.5px)" }} />
          ))}
        </div>

        <div style={{ position: "relative", zIndex: 10 }}>

          {/* Hero */}
          <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,10,10,0.85) 0%, rgba(13,0,20,0.85) 50%, rgba(10,10,26,0.85) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(-55deg, transparent, transparent 60px, rgba(255,107,53,1) 60px, rgba(255,107,53,1) 61px)" }} />
            <div style={{ position: "absolute", top: -60, right: 80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.2) 0%, transparent 70%)", filter: "blur(40px)" }} />

            <div style={{ position: "relative", maxWidth: 800, margin: "0 auto", padding: "clamp(5rem,10vw,7rem) 1.5rem 2rem" }}>
              <nav className="fade-up" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <div style={{ width: 20, height: 2, background: "#FF6B35", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>Admin Panel</span>
                {[{ href: "/dashboard", label: "Dashboard" }, { href: "/admin/users", label: "Users" }].map(item => (
                  <span key={item.href} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "rgba(255,107,53,0.35)", fontSize: 10 }}>›</span>
                    <Link href={item.href} style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#FF6B35"}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.3)"}
                    >{item.label}</Link>
                  </span>
                ))}
                <span style={{ color: "rgba(255,107,53,0.35)", fontSize: 10 }}>›</span>
                <span style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>Create</span>
              </nav>

              <div className="fade-up" style={{ animationDelay: "0.1s" }}>
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem,5vw,3.25rem)", letterSpacing: "0.03em", lineHeight: 0.92, marginBottom: "0.5rem", background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Create New User
                </h1>
                <p style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: "0.1em" }}>Add a new user account to the system</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ maxWidth: 800, margin: "0 auto", padding: "1.75rem 1.5rem 0" }}>
            <button className="back-btn" onClick={() => router.push("/admin/users")} style={{ marginBottom: "1.25rem" }}>← Back to Users</button>

            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>

              {message && (
                <div style={{ margin: "20px 24px 0", padding: "14px 16px", borderRadius: 14, fontSize: "0.875rem", fontWeight: 600, ...(message.type === "success" ? { background: "rgba(34,197,94,0.08)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" } : { background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }) }}>
                  {message.type === "success" ? "✅" : "❌"} {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* Profile picture */}
                <Section label="Profile Picture" bordered>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 14, overflow: "hidden", border: "2px solid rgba(255,107,53,0.2)", flexShrink: 0 }}>
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #FF6B35, #E63946)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem" }}>{initials}</span>
                        </div>
                      )}
                    </div>
                    <label className="upload-label">Upload Photo<input type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleImageChange} style={{ display: "none" }} /></label>
                    <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>JPG or PNG · max 5MB</p>
                  </div>
                </Section>

                {/* Personal info */}
                <Section label="Personal Information" bordered>
                  <Field label="Full Name *"><input type="text" value={formData.fullName} onChange={e => set("fullName", e.target.value)} className="form-input" placeholder="John Doe" required /></Field>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field label="Email *"><input type="email" value={formData.email} onChange={e => set("email", e.target.value)} className="form-input" placeholder="user@example.com" required /></Field>
                    <Field label="Username *"><input type="text" value={formData.username} onChange={e => set("username", e.target.value)} className="form-input" placeholder="username" required minLength={3} maxLength={30} /></Field>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field label="Phone Number *"><input type="tel" value={formData.phoneNumber} onChange={e => set("phoneNumber", e.target.value)} className="form-input" placeholder="+1 (555) 000-0000" required /></Field>
                    <Field label="Gender *">
                      <select value={formData.gender} onChange={e => set("gender", e.target.value)} className="form-input" required>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </Field>
                  </div>
                </Section>

                {/* Account settings */}
                <Section label="Account Settings" bordered>
                  <Field label="Role *">
                    <select value={formData.role} onChange={e => set("role", e.target.value)} className="form-input" required>
                      <option value="user">👤 User</option>
                      <option value="admin">👑 Admin</option>
                    </select>
                  </Field>
                  <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>Admins have full access to the admin panel</p>
                </Section>

                {/* Security */}
                <Section label="Security" bordered>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field label="Password *"><input type="password" value={formData.password} onChange={e => set("password", e.target.value)} className="form-input" placeholder="••••••••" required minLength={6} /></Field>
                    <Field label="Confirm Password *"><input type="password" value={formData.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} className="form-input" placeholder="••••••••" required minLength={6} /></Field>
                  </div>
                  <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>Password must be at least 6 characters</p>
                </Section>

                {/* Actions */}
                <div style={{ padding: "20px 24px", display: "flex", gap: 10 }}>
                  <button type="submit" disabled={isSubmitting} className="primary-btn" style={{ flex: 1, padding: "13px", background: "linear-gradient(135deg, #FF6B35, #E63946)", borderRadius: 14, color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.12em", boxShadow: "0 0 20px rgba(255,107,53,0.3)" }}>
                    {isSubmitting ? (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                        Creating…
                      </span>
                    ) : "Create User"}
                  </button>
                  <button type="button" onClick={() => router.push("/admin/users")} disabled={isSubmitting} className="cancel-btn" style={{ flex: 1, padding: "13px", borderRadius: 14, fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.12em" }}>Cancel</button>
                </div>
              </form>
            </div>

            <p style={{ textAlign: "center", fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 12, letterSpacing: "0.08em" }}>
              Fields marked with <span style={{ color: "#f87171" }}>*</span> are required
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ label, bordered, children }: { label: string; bordered?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ padding: "20px 24px", borderBottom: bordered ? "1px solid rgba(255,255,255,0.07)" : "none", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 14, height: 2, background: "#FF6B35", flexShrink: 0 }} />
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>{label}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}