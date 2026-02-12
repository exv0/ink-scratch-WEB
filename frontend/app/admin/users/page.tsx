"use client";

import { useState, useEffect } from 'react';
import { adminService } from '@/lib/services/admin.service';
import { useRouter } from 'next/navigation';

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
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // Pagination & search state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery, itemsPerPage]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const result = await adminService.getUsersPaginated({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        sortBy: 'createdAt',
        sortOrder: 'desc',
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
      // Refresh current page
      fetchUsers();
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && !pagination) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to from-slate-900 via-purple-900 to-slate-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-purple-400 opacity-20"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-500/10 backdrop-blur-xl border border-red-500/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-red-400 text-2xl">⚠</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Error</h3>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3">
              User Management
            </h1>
            <p className="text-purple-300 text-lg">
              {pagination ? `Managing ${pagination.totalItems} registered users` : 'Manage all registered users'}
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/users/create')}
            className="group relative bg-gradient-to from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
          >
            <span className="flex items-center gap-2">
              <span className="text-2xl">+</span>
              <span>Create User</span>
            </span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 mb-8 shadow-xl">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or username..."
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-6 py-4 bg-slate-900/50 border border-purple-500/30 rounded-xl text-white focus:ring-2 focus:ring-purple-500 cursor-pointer hover:bg-slate-900/70 transition-all"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </form>
        </div>

        {/* Stats */}
        {pagination && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="group bg-gradient-to from-purple-500/10 to-blue-500/10 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium uppercase tracking-wider">Total Users</p>
                  <p className="text-5xl font-bold text-white mt-2">{pagination.totalItems}</p>
                </div>
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">👥</span>
                </div>
              </div>
            </div>
            <div className="group bg-gradient-to from-pink-500/10 to-purple-500/10 backdrop-blur-xl border border-pink-500/30 rounded-2xl p-6 hover:border-pink-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-300 text-sm font-medium uppercase tracking-wider">Current Page</p>
                  <p className="text-5xl font-bold text-white mt-2">
                    {pagination.currentPage} / {pagination.totalPages}
                  </p>
                </div>
                <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">📄</span>
                </div>
              </div>
            </div>
            <div className="group bg-gradient-to from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium uppercase tracking-wider">Showing</p>
                  <p className="text-5xl font-bold text-white mt-2">{users.length}</p>
                </div>
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-3xl">📊</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-400 opacity-20"></div>
              </div>
              <p className="text-purple-300 mt-4">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-purple-300 text-xl mb-4">No users found</p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="text-purple-400 hover:text-purple-300 underline transition-colors"
                >
                  Clear search and show all users
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to from-purple-900/50 to-blue-900/50">
                  <tr>
                    <th className="px-6 py-5 text-left text-xs font-bold text-purple-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-purple-300 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-purple-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-purple-300 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-5 text-right text-xs font-bold text-purple-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/10">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-purple-500/10 transition-colors duration-200">
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <div className="relative h-14 w-14 rounded-full bg-gradient-to from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                            {user.profilePicture ? (
                              <>
                                <img
                                  src={user.profilePicture}
                                  alt={user.username}
                                  className="h-14 w-14 rounded-full object-cover"
                                />
                                <div className="absolute inset-0 rounded-full ring-2 ring-purple-400/50"></div>
                              </>
                            ) : (
                              <span className="text-xl">{user.username.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-semibold text-lg">{user.fullName}</p>
                            <p className="text-purple-300 text-sm">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-white text-sm flex items-center gap-2">
                          <span className="text-purple-400">✉️</span>
                          {user.email}
                        </p>
                        <p className="text-purple-300 text-sm flex items-center gap-2 mt-1">
                          <span className="text-purple-400">📱</span>
                          {user.phoneNumber}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                          user.role === 'admin'
                            ? 'bg-gradient-to from-pink-500/20 to-red-500/20 text-pink-300 border-2 border-pink-500/50 shadow-lg shadow-pink-500/20'
                            : 'bg-gradient-to from-blue-500/20 to-cyan-500/20 text-blue-300 border-2 border-blue-500/50 shadow-lg shadow-blue-500/20'
                        }`}>
                          {user.role === 'admin' ? '👑 ' : ''}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-white text-sm font-medium">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => router.push(`/admin/users/${user._id}`)}
                            className="text-blue-400 hover:text-blue-300 transition-colors font-semibold hover:underline"
                          >
                            View
                          </button>
                          <button
                            onClick={() => router.push(`/admin/users/${user._id}/edit`)}
                            className="text-purple-400 hover:text-purple-300 transition-colors font-semibold hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(user._id)}
                            className="text-red-400 hover:text-red-300 transition-colors font-semibold hover:underline"
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

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-purple-300 text-sm">
              Showing <span className="font-bold text-white">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span> to{' '}
              <span className="font-bold text-white">{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}</span> of{' '}
              <span className="font-bold text-white">{pagination.totalItems}</span> users
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-6 py-3 bg-gradient-to from-purple-600/20 to-blue-600/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:from-purple-600/40 hover:to-blue-600/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-purple-500/30 hover:border-purple-400/50"
              >
                ← Previous
              </button>
              
              {/* Page numbers */}
              <div className="flex gap-2">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-5 py-3 rounded-xl font-bold transition-all border ${
                        pageNum === pagination.currentPage
                          ? 'bg-gradient-to from-purple-600 to-blue-600 text-white border-purple-400 shadow-lg shadow-purple-500/50 scale-110'
                          : 'bg-purple-600/20 backdrop-blur-sm text-purple-300 border-purple-500/30 hover:bg-purple-600/40 hover:border-purple-400/50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-6 py-3 bg-gradient-to from-purple-600/20 to-blue-600/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:from-purple-600/40 hover:to-blue-600/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-purple-500/30 hover:border-purple-400/50"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to from-slate-900 to-purple-900 border-2 border-red-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-red-500/20 animate-in">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-5xl">⚠️</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Confirm Delete</h3>
                <p className="text-purple-300 text-lg">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-gradient-to from-red-600 to-red-700 text-white py-4 rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-105 shadow-lg shadow-red-500/30"
                >
                  Delete User
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gradient-to from-slate-700 to-slate-800 text-white py-4 rounded-xl font-bold hover:from-slate-600 hover:to-slate-700 transition-all transform hover:scale-105 border border-purple-500/30"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}