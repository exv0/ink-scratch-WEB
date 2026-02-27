"use client";

import { useState, useEffect } from "react";
import { adminService } from "@/lib/services/admin.service";
import { useRouter } from "next/navigation";
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
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const SearchIcon = () => (
  <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
  </svg>
);

const PlusIcon = () => (
  <svg style={{ width: 14, height: 14 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => { fetchUsers(); }, [currentPage, searchQuery, itemsPerPage]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const result = await adminService.getUsersPaginated({
        page: currentPage, limit: itemsPerPage,
        search: searchQuery, sortBy: "createdAt", sortOrder: "desc",
      });
      setUsers(result.data as User[]);
      setPagination(result.pagination);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      setDeleteConfirm(null);
      fetchUsers();
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const initials = (name: string) => name?.[0]?.toUpperCase() ?? "?";

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading && !pagination) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, margin: "0 auto 16px", border: "3px solid rgba(255,107,53,0.2)", borderTop: "3px solid #FF6B35", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Loading…</p>
      </div>
    </div>
  );

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</p>
        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.05em", color: "#fff", marginBottom: "0.5rem" }}>Something went wrong</p>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>{error}</p>
        <button onClick={fetchUsers} style={primaryBtnStyle}>Try Again</button>
      </div>
    </div>
  );

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

        .user-row { transition: background 0.2s, border-color 0.2s; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .user-row:hover { background: rgba(255,107,53,0.03); }
        .user-row:hover .row-name { color: #FF6B35; }

        .action-link { background: transparent; border: none; cursor: pointer; padding: 6px 10px; border-radius: 8px; font-family: 'Share Tech Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.2s; }
        .action-view:hover  { background: rgba(255,107,53,0.08); color: #FF6B35 !important; }
        .action-edit:hover  { background: rgba(255,107,53,0.08); color: #FF6B35 !important; }
        .action-delete:hover { background: rgba(239,68,68,0.1); color: #f87171 !important; }

        .search-input { width: 100%; padding: 10px 10px 10px 38px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: rgba(255,255,255,0.8); font-family: 'Noto Sans JP', sans-serif; font-size: 0.875rem; outline: none; transition: border-color 0.2s, background 0.2s; box-sizing: border-box; }
        .search-input::placeholder { color: rgba(255,255,255,0.2); }
        .search-input:focus { border-color: rgba(255,107,53,0.4); background: rgba(255,107,53,0.03); }

        .select-input { padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: rgba(255,255,255,0.7); font-family: 'Share Tech Mono', monospace; font-size: 11px; letter-spacing: 0.08em; outline: none; cursor: pointer; transition: border-color 0.2s; }
        .select-input:focus { border-color: rgba(255,107,53,0.4); }
        .select-input option { background: #16161f; }

        .pg-btn { padding: 6px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: rgba(255,255,255,0.5); font-family: 'Bebas Neue', sans-serif; font-size: 0.95rem; letter-spacing: 0.08em; cursor: pointer; transition: all 0.2s; }
        .pg-btn:hover:not(:disabled) { border-color: rgba(255,107,53,0.4); color: #FF6B35; }
        .pg-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .pg-btn-active { background: linear-gradient(135deg, #FF6B35, #E63946) !important; border-color: transparent !important; color: #fff !important; }

        .primary-btn { padding: 11px 22px; background: linear-gradient(135deg, #FF6B35, #E63946); border: none; border-radius: 12px; color: #fff; font-family: 'Bebas Neue', sans-serif; font-size: 1rem; letter-spacing: 0.1em; cursor: pointer; transition: all 0.25s; box-shadow: 0 0 20px rgba(255,107,53,0.3); display: flex; align-items: center; gap: 6px; }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 0 30px rgba(255,107,53,0.45); }

        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: rgba(255,107,53,0.35); border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff", fontFamily: "'Noto Sans JP', sans-serif", paddingBottom: "5rem" }}>

        {/* ── Fixed background ──────────────────────────────────────────── */}
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

          {/* ── Hero ──────────────────────────────────────────────────── */}
          <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,10,10,0.8) 0%, rgba(13,0,20,0.8) 50%, rgba(10,10,26,0.8) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(-55deg, transparent, transparent 60px, rgba(255,107,53,1) 60px, rgba(255,107,53,1) 61px)" }} />
            <div style={{ position: "absolute", top: -60, right: 80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.25) 0%, transparent 70%)", filter: "blur(40px)" }} />

            <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "clamp(5rem,10vw,7rem) 1.5rem 1.5rem" }}>
              {/* Breadcrumb */}
              <nav className="fade-up" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.5rem" }}>
                <div style={{ width: 20, height: 2, background: "#FF6B35", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)" }}>Admin Panel</span>
                <span style={{ color: "rgba(255,107,53,0.35)", fontSize: 10 }}>›</span>
                <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}
                  onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#FF6B35"}
                  onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.3)"}
                >Dashboard</Link>
                <span style={{ color: "rgba(255,107,53,0.35)", fontSize: 10 }}>›</span>
                <span style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>Users</span>
              </nav>

              <div className="fade-up" style={{ animationDelay: "0.1s", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1.5rem", paddingBottom: "1.75rem" }}>
                <div>
                  <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem,6vw,4rem)", letterSpacing: "0.03em", lineHeight: 0.92, marginBottom: "0.5rem", background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    User Management
                  </h1>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: "0.1em" }}>
                    {pagination ? `${pagination.totalItems} registered users` : "Manage all registered users"}
                  </p>
                </div>
                <button className="primary-btn" onClick={() => router.push("/admin/users/create")}>
                  <PlusIcon /> Create User
                </button>
              </div>
            </div>

            {/* Stats bar */}
            {pagination && (
              <div style={{ position: "relative", borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)" }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "repeat(3,auto)", width: "fit-content", gap: 0 }}>
                  {[
                    { label: "Total Users", value: pagination.totalItems },
                    { label: "Showing",     value: users.length },
                    { label: "Pages",       value: pagination.totalPages },
                  ].map((s, i) => (
                    <div key={s.label} style={{ textAlign: "center", padding: "14px 32px", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.04em", color: "#fff", lineHeight: 1 }}>{s.value}</p>
                      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 3 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Search + filter ──────────────────────────────────────── */}
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "1.5rem 1.5rem 0" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", padding: "14px 16px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16 }}>
              <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }}><SearchIcon /></span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Search by name, email or username…"
                  className="search-input"
                />
              </div>
              <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="select-input">
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
              </select>
            </div>
          </div>

          {/* ── Table ────────────────────────────────────────────────── */}
          <div style={{ maxWidth: 1280, margin: "1rem auto 0", padding: "0 1.5rem" }}>
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden" }}>

              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 2rem" }}>
                  <div style={{ width: 36, height: 36, border: "3px solid rgba(255,107,53,0.2)", borderTop: "3px solid #FF6B35", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 14 }} />
                  <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Share Tech Mono', monospace", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>Loading users…</p>
                </div>
              ) : users.length === 0 ? (
                <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
                  <p style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</p>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: "0.05em", color: "#fff", marginBottom: "0.375rem" }}>No Users Found</p>
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(""); setCurrentPage(1); }} style={{ background: "none", border: "none", color: "#FF6B35", fontFamily: "'Share Tech Mono', monospace", fontSize: 12, letterSpacing: "0.1em", cursor: "pointer", marginTop: 8, textDecoration: "underline" }}>
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                        {["User", "Contact", "Role", "Joined", "Actions"].map((h, i) => (
                          <th key={h} style={{ padding: "14px 20px", textAlign: i === 4 ? "right" : "left", fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,107,53,0.6)", fontWeight: 700 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="user-row">
                          {/* User */}
                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", border: "2px solid rgba(255,107,53,0.15)", flexShrink: 0 }}>
                                {user.profilePicture ? (
                                  <img src={user.profilePicture} alt={user.username} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #FF6B35, #E63946)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem" }}>{initials(user.fullName)}</span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="row-name" style={{ fontSize: "0.875rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", transition: "color 0.2s" }}>{user.fullName}</p>
                                <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>@{user.username}</p>
                              </div>
                            </div>
                          </td>
                          {/* Contact */}
                          <td style={{ padding: "14px 20px" }}>
                            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>{user.email}</p>
                            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{user.phoneNumber}</p>
                          </td>
                          {/* Role */}
                          <td style={{ padding: "14px 20px" }}>
                            <span style={{
                              fontFamily: "'Share Tech Mono', monospace", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase",
                              padding: "4px 10px", borderRadius: 20,
                              ...(user.role === "admin"
                                ? { background: "linear-gradient(135deg, #FF6B35, #E63946)", color: "#fff" }
                                : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }
                              ),
                            }}>
                              {user.role === "admin" ? "👑 " : "👤 "}{user.role}
                            </span>
                          </td>
                          {/* Joined */}
                          <td style={{ padding: "14px 20px" }}>
                            <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>
                              {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </p>
                          </td>
                          {/* Actions */}
                          <td style={{ padding: "14px 20px", textAlign: "right" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                              <button className="action-link action-view" style={{ color: "rgba(255,255,255,0.35)" }} onClick={() => router.push(`/admin/users/${user._id}`)}>View</button>
                              <button className="action-link action-edit" style={{ color: "rgba(255,255,255,0.35)" }} onClick={() => router.push(`/admin/users/${user._id}/edit`)}>Edit</button>
                              <button className="action-link action-delete" style={{ color: "rgba(255,255,255,0.35)" }} onClick={() => setDeleteConfirm(user._id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* ── Pagination ───────────────────────────────────────── */}
            {pagination && pagination.totalPages > 1 && (
              <div style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.05em" }}>
                  Showing{" "}
                  <span style={{ color: "#fff", fontWeight: 700 }}>{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span>
                  {" – "}
                  <span style={{ color: "#fff", fontWeight: 700 }}>{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}</span>
                  {" of "}
                  <span style={{ color: "#fff", fontWeight: 700 }}>{pagination.totalItems}</span> users
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button className="pg-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={!pagination.hasPrevPage}>← Prev</button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let p: number;
                    if (pagination.totalPages <= 5) p = i + 1;
                    else if (pagination.currentPage <= 3) p = i + 1;
                    else if (pagination.currentPage >= pagination.totalPages - 2) p = pagination.totalPages - 4 + i;
                    else p = pagination.currentPage - 2 + i;
                    return (
                      <button key={p} onClick={() => handlePageChange(p)} className={`pg-btn${p === pagination.currentPage ? " pg-btn-active" : ""}`} style={{ width: 36, padding: "6px 0", textAlign: "center" }}>{p}</button>
                    );
                  })}
                  <button className="pg-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={!pagination.hasNextPage}>Next →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Delete Modal ──────────────────────────────────────────────── */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
          <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "2rem", maxWidth: 360, width: "100%", boxShadow: "0 0 60px rgba(0,0,0,0.8)" }}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ width: 60, height: 60, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "1.75rem" }}>⚠️</div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.75rem", letterSpacing: "0.05em", color: "#fff", marginBottom: "0.5rem" }}>Delete User?</h3>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem", lineHeight: 1.6 }}>This action is permanent and cannot be undone.</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #ef4444, #dc2626)", border: "none", borderRadius: 12, color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em", cursor: "pointer" }}>Delete</button>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.6)", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const primaryBtnStyle: React.CSSProperties = {
  padding: "11px 28px", background: "linear-gradient(135deg, #FF6B35, #E63946)", border: "none", borderRadius: 12, color: "#fff", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", letterSpacing: "0.1em", cursor: "pointer", boxShadow: "0 0 20px rgba(255,107,53,0.3)",
};