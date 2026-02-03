// app/admin/users/page.tsx
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

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const result = await adminService.getAllUsers();
      setUsers(result.data as User[]);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      setDeleteConfirm(null);
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
          <p className="text-purple-300">Manage all registered users</p>
        </div>
        <button
          onClick={() => router.push('/admin/users/create')}
          className="bg-linear-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
        >
          + Create User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <p className="text-purple-300 text-sm font-medium">Total Users</p>
          <p className="text-4xl font-bold text-white mt-2">{users.length}</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <p className="text-purple-300 text-sm font-medium">Admins</p>
          <p className="text-4xl font-bold text-white mt-2">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <p className="text-purple-300 text-sm font-medium">Regular Users</p>
          <p className="text-4xl font-bold text-white mt-2">
            {users.filter(u => u.role === 'user').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-purple-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold mr-4">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          user.username.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{user.fullName}</p>
                        <p className="text-purple-300 text-sm">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white text-sm">{user.email}</p>
                    <p className="text-purple-300 text-sm">{user.phoneNumber}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin'
                        ? 'bg-pink-500/20 text-pink-300 border border-pink-500/50'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => router.push(`/admin/users/${user._id}`)}
                      className="text-purple-300 hover:text-white transition-colors font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => router.push(`/admin/users/${user._id}/edit`)}
                      className="text-blue-300 hover:text-white transition-colors font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(user._id)}
                      className="text-red-300 hover:text-white transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-purple-500/30 rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-4">Confirm Delete</h3>
            <p className="text-purple-300 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
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