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
      <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", margin: "0 auto 16px", border: "3px solid rgba(255,107,53,0.2)", borderTop: "3px solid #FF6B35", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading…</p>
        </div>
      </div>
    );
  }

  const initials = (user.fullName || user.username || "?")[0].toUpperCase();

  const fields = [
    { label: "Full Name",  value: user.fullName,     icon: "👤" },
    { label: "Username",   value: `@${user.username}`, icon: "🏷️" },
    { label: "Email",      value: user.email,         icon: "✉️" },
    { label: "Phone",      value: user.phoneNumber,   icon: "📱" },
    { label: "Gender",     value: user.gender,        icon: "⚧️" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+JP:wght@300;400;500;700;900&family=Share+Tech+Mono&display=swap');

        @keyframes spin { to { transform: rotate(360deg); } }

        @keyframes ink-float {
          0%   { opacity: 0; transform: translateY(0) scale(0.5) rotate(0deg); }
          15%  { opacity: 0.7; }
          85%  { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-600px) scale(1.5) rotate(180deg); }
        }
        .ink-float { animation: ink-float linear infinite; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fade-up 0.75s cubic-bezier(0.16,1,0.3,1) both; }

        .tab-btn { transition: all 0.2s; cursor: pointer; border: none; background: transparent; }
        .tab-btn:hover { color: #FF6B35; }

        .field-row {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 16px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          transition: border-color 0.2s, background 0.2s;
        }
        .field-row:hover {
          border-color: rgba(255,107,53,0.25);
          background: rgba(255,107,53,0.03);
        }

        .save-btn {
          transition: all 0.25s;
        }
        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(255,107,53,0.45) !important;
        }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .cancel-btn {
          transition: all 0.2s;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.6);
          cursor: pointer;
        }
        .cancel-btn:hover {
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.07);
          color: #fff;
        }

        .upload-label {
          display: inline-block;
          padding: 8px 20px;
          border: 1px solid rgba(255,107,53,0.35);
          border-radius: 10px;
          color: #FF6B35;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
        }
        .upload-label:hover {
          background: rgba(255,107,53,0.08);
          border-color: rgba(255,107,53,0.6);
        }

        .bio-textarea {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          color: rgba(255,255,255,0.85);
          font-family: 'Noto Sans JP', sans-serif;
          font-size: 0.875rem;
          line-height: 1.7;
          resize: none;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .bio-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .bio-textarea:focus {
          border-color: rgba(255,107,53,0.45);
          background: rgba(255,107,53,0.03);
          box-shadow: 0 0 0 3px rgba(255,107,53,0.08);
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: rgba(255,107,53,0.35); border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Noto Sans JP', sans-serif", paddingBottom: "5rem" }}>

        {/* ── Fixed background ─────────────────────────────────────────────── */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-10%", left: "20%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.25) 0%, transparent 70%)", filter: "blur(90px)", opacity: 0.15 }} />
          <div style={{ position: "absolute", bottom: "10%", right: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,57,70,0.35) 0%, transparent 70%)", filter: "blur(80px)", opacity: 0.1 }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "radial-gradient(circle, #FF6B35 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)" }} />
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="ink-float" style={{
              position: "absolute", left: `${(i * 53 + 7) % 92}%`, bottom: "-10px",
              width: `${3 + (i % 4) * 2}px`, height: `${3 + (i % 4) * 2}px`,
              borderRadius: "50%",
              background: i % 2 === 0
                ? "radial-gradient(circle, rgba(255,107,53,0.5), transparent)"
                : "radial-gradient(circle, rgba(230,57,70,0.4), transparent)",
              animationDelay: `${i * 1.1}s`,
              animationDuration: `${8 + (i % 4)}s`,
              filter: "blur(1.5px)",
            }} />
          ))}
        </div>

        {/* ── Page content ─────────────────────────────────────────────────── */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: "720px", margin: "0 auto", padding: "clamp(5rem,10vw,7rem) 1.5rem 0" }}>

          {/* Breadcrumb */}
          <nav className="fade-up" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2rem" }}>
            <div style={{ width: "20px", height: "2px", background: "#FF6B35", flexShrink: 0 }} />
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>
              User Profile
            </span>
            <span style={{ color: "rgba(255,107,53,0.35)", fontFamily: "'Share Tech Mono', monospace", fontSize: "10px" }}>›</span>
            <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#FF6B35"}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.3)"}
            >Dashboard</Link>
          </nav>

          {/* ── Profile card ─────────────────────────────────────────────── */}
          <div className="fade-up" style={{ animationDelay: "0.1s", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px", overflow: "hidden" }}>

            {/* Banner */}
            <div style={{ position: "relative", height: "120px", background: "linear-gradient(135deg, #1a0a0a 0%, #0d0014 50%, #0a0a1a 100%)", overflow: "hidden", zIndex: 1 }}>
              {/* Diagonal speed lines */}
              <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "repeating-linear-gradient(-55deg, transparent, transparent 60px, rgba(255,107,53,1) 60px, rgba(255,107,53,1) 61px)" }} />
              {/* Glow orbs */}
              <div style={{ position: "absolute", top: "-40px", right: "60px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.3) 0%, transparent 70%)", filter: "blur(30px)" }} />
              <div style={{ position: "absolute", bottom: "-40px", left: "30px", width: "150px", height: "150px", borderRadius: "50%", background: "radial-gradient(circle, rgba(230,57,70,0.25) 0%, transparent 70%)", filter: "blur(25px)" }} />
              {/* Chapter tag */}
              <div style={{ position: "absolute", top: "16px", left: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "14px", height: "2px", background: "#FF6B35" }} />
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>
                  User Profile
                </span>
              </div>
            </div>

            {/* Avatar + role row */}
            <div style={{ padding: "0 28px", marginTop: "-36px", marginBottom: "20px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
              {/* Avatar */}
              <div style={{ width: "72px", height: "72px", borderRadius: "16px", overflow: "hidden", border: "3px solid #0a0a0f", boxShadow: "0 0 20px rgba(255,107,53,0.2)", flexShrink: 0 }}>
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #FF6B35, #E63946)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.05em" }}>{initials}</span>
                  </div>
                )}
              </div>

              {/* Role badge */}
              <div style={{ marginBottom: "4px" }}>
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase",
                  padding: "4px 12px", borderRadius: "20px",
                  ...(user.role === "admin"
                    ? { background: "linear-gradient(135deg, #FF6B35, #E63946)", color: "#fff" }
                    : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }
                  ),
                }}>
                  {user.role}
                </span>
              </div>
            </div>

            {/* Name + username + bio */}
            <div style={{ padding: "0 28px 24px" }}>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.05em", color: "#fff", lineHeight: 1, marginBottom: "4px" }}>
                {user.fullName}
              </h1>
              <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: user.bio ? "12px" : 0 }}>
                @{user.username}
              </p>
              {user.bio && (
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: "480px", fontWeight: 300 }}>{user.bio}</p>
              )}
            </div>

            {/* ── Tabs ─────────────────────────────────────────────────── */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex" }}>
              {(["info", "edit"] as const).map(t => (
                <button key={t} className="tab-btn" onClick={() => setActiveTab(t)} style={{
                  flex: 1, padding: "12px 0",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1rem", letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: activeTab === t ? "#FF6B35" : "rgba(255,255,255,0.3)",
                  borderBottom: `2px solid ${activeTab === t ? "#FF6B35" : "transparent"}`,
                  marginBottom: "-1px",
                }}>
                  {t === "info" ? "Account Info" : "Edit Profile"}
                </button>
              ))}
            </div>

            {/* ── Tab content ───────────────────────────────────────── */}
            <div style={{ padding: "28px" }}>

              {/* INFO tab */}
              {activeTab === "info" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {fields.map(field => (
                    <div key={field.label} className="field-row">
                      <span style={{ fontSize: "1.1rem", width: "28px", textAlign: "center", flexShrink: 0 }}>{field.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,107,53,0.5)", marginBottom: "3px" }}>{field.label}</p>
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{field.value || "—"}</p>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setActiveTab("edit")}
                    className="save-btn"
                    style={{ marginTop: "8px", width: "100%", padding: "13px", background: "linear-gradient(135deg, #FF6B35, #E63946)", border: "none", borderRadius: "14px", color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.12em", cursor: "pointer", boxShadow: "0 0 20px rgba(255,107,53,0.3)" }}
                  >
                    Edit Profile
                  </button>
                </div>
              )}

              {/* EDIT tab */}
              {activeTab === "edit" && (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                  {/* Message banner */}
                  {message && (
                    <div style={{
                      padding: "14px 16px", borderRadius: "14px", fontSize: "0.875rem", fontWeight: 600,
                      ...(message.type === "success"
                        ? { background: "rgba(34,197,94,0.08)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }
                        : { background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }
                      ),
                    }}>
                      {message.type === "success" ? "✅" : "❌"} {message.text}
                    </div>
                  )}

                  {/* Profile picture */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                      <div style={{ width: "14px", height: "2px", background: "#FF6B35" }} />
                      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>Profile Picture</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "60px", height: "60px", borderRadius: "14px", overflow: "hidden", border: "2px solid rgba(255,107,53,0.2)", flexShrink: 0 }}>
                        {previewUrl ? (
                          <img src={previewUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #FF6B35, #E63946)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem" }}>{initials}</span>
                          </div>
                        )}
                      </div>
                      <label className="upload-label">
                        Upload Photo
                        <input type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleImageChange} style={{ display: "none" }} />
                      </label>
                      <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>JPG or PNG · max 5MB</p>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                      <div style={{ width: "14px", height: "2px", background: "#FF6B35" }} />
                      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>Bio</span>
                    </div>
                    <textarea
                      className="bio-textarea"
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={160}
                      rows={4}
                      placeholder="Tell readers about yourself..."
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                      <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>Share your reading vibe</p>
                      <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "10px", color: bio.length > 140 ? "#f87171" : "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>
                        {bio.length}/160
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="save-btn"
                      style={{ flex: 1, padding: "13px", background: "linear-gradient(135deg, #FF6B35, #E63946)", border: "none", borderRadius: "14px", color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.12em", cursor: "pointer", boxShadow: "0 0 20px rgba(255,107,53,0.3)" }}
                    >
                      {isLoading ? (
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                          <span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                          Saving…
                        </span>
                      ) : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("info")}
                      className="cancel-btn"
                      style={{ flex: 1, padding: "13px", borderRadius: "14px", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.12em" }}
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
    </>
  );
}