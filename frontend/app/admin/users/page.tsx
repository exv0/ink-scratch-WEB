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

// ─── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        sortBy: "createdAt",
        sortOrder: "desc",
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

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading && !pagination) {
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

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-divider p-10 max-w-md w-full text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h3 className="text-xl font-black text-text-primary mb-2">Something went wrong</h3>
          <p className="text-text-secondary text-sm">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-6 px-6 py-2.5 bg-linear-to-r from-orange to-red text-white font-black text-sm rounded-xl shadow-md shadow-orange/20 hover:scale-105 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">

      {/* ── Hero Banner ───────────────────────────────────────────────────────── */}
      <div className="relative bg-linear-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/40 font-semibold mb-5">
            <Link href="/dashboard" className="hover:text-white/70 transition-colors">Dashboard</Link>
            <span>›</span>
            <span className="text-white/70">Admin Panel</span>
            <span>›</span>
            <span className="text-white/70">Users</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-orange/80 text-xs font-black tracking-widest uppercase mb-1">Admin Panel</p>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-1">User Management</h1>
              <p className="text-white/40 text-sm">
                {pagination ? `${pagination.totalItems} registered users` : "Manage all registered users"}
              </p>
            </div>

            <button
              onClick={() => router.push("/admin/users/create")}
              className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-orange to-red text-white font-black text-sm rounded-xl shadow-lg shadow-orange/25 hover:scale-105 hover:shadow-orange/40 transition-all duration-200 self-start md:self-auto"
            >
              <PlusIcon />
              Create User
            </button>
          </div>

          {/* Stats */}
          {pagination && (
            <div className="grid grid-cols-3 gap-4 mt-8 max-w-lg">
              {[
                { label: "Total Users",  value: pagination.totalItems },
                { label: "Showing",      value: users.length },
                { label: "Pages",        value: pagination.totalPages },
              ].map((s) => (
                <div key={s.label} className="bg-white/8 backdrop-blur border border-white/10 rounded-2xl px-4 py-3">
                  <p className="text-white font-black text-2xl leading-none">{s.value}</p>
                  <p className="text-white/40 text-[10px] font-semibold mt-1 tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Search + Filter Bar ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl border border-divider shadow-sm p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by name, email or username…"
              className="w-full pl-10 pr-4 py-2.5 text-sm font-medium text-text-primary bg-card border border-divider rounded-xl focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange/40 transition-all placeholder:text-text-secondary/50"
            />
          </div>
          <select
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
            className="text-sm font-bold text-text-primary bg-card border border-divider rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange/30 cursor-pointer"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-2xl border border-divider shadow-sm overflow-hidden">

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-orange/20 border-t-orange rounded-full animate-spin" />
              <p className="text-text-secondary text-sm font-medium mt-4">Loading users…</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-text-primary font-black text-lg mb-1">No users found</p>
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                  className="mt-3 text-sm font-bold text-orange hover:underline underline-offset-4"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-divider bg-card">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-text-secondary tracking-widest uppercase">User</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-text-secondary tracking-widest uppercase">Contact</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-text-secondary tracking-widest uppercase">Role</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-text-secondary tracking-widest uppercase">Joined</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-text-secondary tracking-widest uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-card/60 transition-colors duration-150 group">
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-divider shrink-0">
                            {user.profilePicture ? (
                              <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-linear-to-br from-orange to-red flex items-center justify-center">
                                <span className="text-white text-sm font-black">{initials(user.fullName)}</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-black text-text-primary group-hover:text-orange transition-colors">{user.fullName}</p>
                            <p className="text-xs text-text-secondary">@{user.username}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-text-primary">{user.email}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{user.phoneNumber}</p>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                          user.role === "admin"
                            ? "bg-linear-to-r from-orange to-red text-white shadow-sm shadow-orange/20"
                            : "bg-card text-text-secondary border border-divider"
                        }`}>
                          {user.role === "admin" ? "👑" : "👤"} {user.role}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-text-primary font-medium">
                          {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => router.push(`/admin/users/${user._id}`)}
                            className="px-3 py-1.5 text-xs font-black text-text-secondary hover:text-orange hover:bg-orange/8 rounded-lg transition-all"
                          >
                            View
                          </button>
                          <button
                            onClick={() => router.push(`/admin/users/${user._id}/edit`)}
                            className="px-3 py-1.5 text-xs font-black text-text-secondary hover:text-orange hover:bg-orange/8 rounded-lg transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(user._id)}
                            className="px-3 py-1.5 text-xs font-black text-text-secondary hover:text-red hover:bg-red/8 rounded-lg transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Pagination ──────────────────────────────────────────────────────── */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-text-secondary">
              Showing{" "}
              <span className="font-black text-text-primary">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span>
              {" "}–{" "}
              <span className="font-black text-text-primary">{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}</span>
              {" "}of{" "}
              <span className="font-black text-text-primary">{pagination.totalItems}</span> users
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 text-sm font-black text-text-primary bg-white border border-divider rounded-xl hover:border-orange/40 hover:text-orange disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>

              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let p: number;
                if (pagination.totalPages <= 5) p = i + 1;
                else if (pagination.currentPage <= 3) p = i + 1;
                else if (pagination.currentPage >= pagination.totalPages - 2) p = pagination.totalPages - 4 + i;
                else p = pagination.currentPage - 2 + i;
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 text-sm font-black rounded-xl border transition-all ${
                      p === pagination.currentPage
                        ? "bg-linear-to-r from-orange to-red text-white border-transparent shadow-sm shadow-orange/20"
                        : "bg-white text-text-secondary border-divider hover:border-orange/40 hover:text-orange"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 text-sm font-black text-text-primary bg-white border border-divider rounded-xl hover:border-orange/40 hover:text-orange disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete Modal ──────────────────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-divider shadow-2xl p-8 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-xl font-black text-text-primary mb-2">Delete User?</h3>
              <p className="text-text-secondary text-sm">This action is permanent and cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 bg-red text-white font-black text-sm rounded-2xl hover:opacity-90 transition-opacity"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 bg-card text-text-primary font-black text-sm rounded-2xl hover:bg-divider transition-colors border border-divider"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}