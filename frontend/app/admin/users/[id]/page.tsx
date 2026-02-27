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
    <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
      <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,107,53,0.5)", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{value || "—"}</p>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
      <div style={{ width: 14, height: 2, background: "#FF6B35", flexShrink: 0 }} />
      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>{label}</span>
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

  if (isLoading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, margin: "0 auto 16px", border: "3px solid rgba(255,107,53,0.2)", borderTop: "3px solid #FF6B35", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading…</p>
      </div>
    </div>
  );

  if (error || !user) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</p>
        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.05em", color: "#fff", marginBottom: "0.5rem" }}>User Not Found</p>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>{error}</p>
        <button onClick={() => router.push("/admin/users")} style={primaryBtnStyle}>Back to Users</button>
      </div>
    </div>
  );

  const initials = user.fullName?.[0]?.toUpperCase() ?? "?";
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });

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

        .detail-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 24px; margin-bottom: 12px; }

        .edit-btn { padding: 10px 22px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; color: rgba(255,255,255,0.7); font-family: 'Bebas Neue', sans-serif; font-size: 1rem; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s; }
        .edit-btn:hover { border-color: rgba(255,107,53,0.4); color: #FF6B35; background: rgba(255,107,53,0.06); }

        .back-btn { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.35); font-family: 'Share Tech Mono', monospace; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; transition: color 0.2s; display: flex; align-items: center; gap: 6px; padding: 0; }
        .back-btn:hover { color: #FF6B35; }

        .primary-btn { transition: all 0.25s; }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 0 30px rgba(255,107,53,0.45) !important; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: rgba(255,107,53,0.35); border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Noto Sans JP', sans-serif", paddingBottom: "5rem" }}>

        {/* ── Fixed background ──────────────────────────────────── */}
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

          {/* ── Hero ───────────────────────────────────────────────── */}
          <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,10,10,0.85) 0%, rgba(13,0,20,0.85) 50%, rgba(10,10,26,0.85) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(-55deg, transparent, transparent 60px, rgba(255,107,53,1) 60px, rgba(255,107,53,1) 61px)" }} />
            <div style={{ position: "absolute", top: -60, right: 80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.2) 0%, transparent 70%)", filter: "blur(40px)" }} />

            <div style={{ position: "relative", maxWidth: 960, margin: "0 auto", padding: "clamp(5rem,10vw,7rem) 1.5rem 2rem" }}>
              {/* Breadcrumb */}
              <nav className="fade-up" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.75rem", flexWrap: "wrap" }}>
                <div style={{ width: 20, height: 2, background: "#FF6B35", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>Admin Panel</span>
                {[
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/admin/users", label: "Users" },
                ].map(item => (
                  <span key={item.href} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "rgba(255,107,53,0.35)", fontSize: 10 }}>›</span>
                    <Link href={item.href} style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#FF6B35"}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.3)"}
                    >{item.label}</Link>
                  </span>
                ))}
                <span style={{ color: "rgba(255,107,53,0.35)", fontSize: 10 }}>›</span>
                <span style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>{user.fullName.toUpperCase()}</span>
              </nav>

              {/* User identity row */}
              <div className="fade-up" style={{ animationDelay: "0.1s", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  {/* Avatar */}
                  <div style={{ width: 68, height: 68, borderRadius: 16, overflow: "hidden", border: "3px solid rgba(255,107,53,0.25)", boxShadow: "0 0 24px rgba(255,107,53,0.15)", flexShrink: 0 }}>
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #FF6B35, #E63946)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem" }}>{initials}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.75rem,4vw,2.5rem)", letterSpacing: "0.04em", color: "#fff", lineHeight: 1 }}>{user.fullName}</h1>
                      <span style={{
                        fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
                        padding: "4px 10px", borderRadius: 20,
                        ...(user.role === "admin"
                          ? { background: "linear-gradient(135deg, #FF6B35, #E63946)", color: "#fff" }
                          : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.12)" }
                        ),
                      }}>
                        {user.role === "admin" ? "👑 " : "👤 "}{user.role}
                      </span>
                    </div>
                    <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>@{user.username} · {user.email}</p>
                  </div>
                </div>
                <button className="edit-btn" onClick={() => router.push(`/admin/users/${userId}/edit`)}>✏️ Edit User</button>
              </div>
            </div>
          </div>

          {/* ── Content ────────────────────────────────────────────── */}
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "1.75rem 1.5rem 0" }}>
            <button className="back-btn" onClick={() => router.push("/admin/users")} style={{ marginBottom: "1.25rem" }}>← Back to Users</button>

            {/* Contact */}
            <div className="detail-card">
              <SectionHeader label="Contact Information" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
                <Field label="Email Address" value={user.email} />
                <Field label="Phone Number" value={user.phoneNumber} />
              </div>
            </div>

            {/* Personal */}
            <div className="detail-card">
              <SectionHeader label="Personal Information" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
                <Field label="Full Name" value={user.fullName} />
                <Field label="Gender" value={user.gender} />
                {/* Status */}
                <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14 }}>
                  <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,107,53,0.5)", marginBottom: 4 }}>Account Status</p>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ position: "relative", display: "inline-flex", width: 10, height: 10 }}>
                      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#4ade80", opacity: 0.6, animation: "ping 1s ease-in-out infinite" }} />
                      <span style={{ position: "relative", width: 10, height: 10, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                    </span>
                    Active
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="detail-card">
                <SectionHeader label="Bio" />
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9375rem", lineHeight: 1.8, fontWeight: 300 }}>{user.bio}</p>
              </div>
            )}

            {/* Timeline */}
            <div className="detail-card">
              <SectionHeader label="Account Timeline" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
                <Field label="Created At" value={formatDate(user.createdAt)} />
                <Field label="Last Updated" value={formatDate(user.updatedAt)} />
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button className="primary-btn" onClick={() => router.push(`/admin/users/${userId}/edit`)} style={{ flex: 1, padding: "13px", background: "linear-gradient(135deg, #FF6B35, #E63946)", border: "none", borderRadius: 14, color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.12em", cursor: "pointer", boxShadow: "0 0 20px rgba(255,107,53,0.3)" }}>
                ✏️ Edit User Profile
              </button>
              <button onClick={() => router.push("/admin/users")} style={{ flex: 1, padding: "13px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "rgba(255,255,255,0.6)", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.12em", cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.6)"; }}
              >
                ← Back to All Users
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.8); opacity: 0; } }
      `}</style>
    </>
  );
}

const primaryBtnStyle: React.CSSProperties = {
  padding: "11px 28px", background: "linear-gradient(135deg, #FF6B35, #E63946)", border: "none", borderRadius: 12, color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em", cursor: "pointer", boxShadow: "0 0 20px rgba(255,107,53,0.3)",
};