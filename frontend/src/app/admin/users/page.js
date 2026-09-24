'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

const roleColors = {
  admin: 'bg-purple-100 text-purple-800',
  user:  'bg-gray-100   text-gray-700',
};

export default function AdminUsersPage() {
  const [users, setUsers]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [updating, setUpdating] = useState(null); // id of user being updated
  const limit = 15;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page, limit,
        ...(search && { search }),
      });
      const res = await api.get(`/auth/admin/users?${params}`);
      setUsers(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const handleRoleChange = async (userId, newRole) => {
    if (!confirm(`Change this user's role to "${newRole}"?`)) return;
    setUpdating(userId);
    try {
      await api.put(`/auth/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, role: newRole } : u)
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update role.');
    } finally {
      setUpdating(null);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">{total} total users</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by name or email..."
          className="input"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              {['#', 'Name', 'Email', 'Phone', 'Role', 'Joined', 'Actions'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="spinner" />
                    <span>Loading users...</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td className="text-gray-400 text-xs">
                    {(page - 1) * limit + index + 1}
                  </td>

                  <td>
                    <div className="flex items-center gap-3">
                      {/* Avatar circle */}
                      <div className="w-9 h-9 rounded-full bg-emerald-100
                                      flex items-center justify-center
                                      text-emerald-700 font-bold text-sm flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-900">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  <td className="text-gray-500">{user.email}</td>

                  <td className="text-gray-500">
                    {user.phone || <span className="text-gray-300">—</span>}
                  </td>

                  <td>
                    <span className={`badge ${roleColors[user.role]}`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="text-gray-500 text-sm">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      dateStyle: 'medium',
                    })}
                  </td>

                  <td>
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-1.5
                                 text-sm focus:outline-none focus:ring-2
                                 focus:ring-emerald-500 disabled:opacity-50"
                      value={user.role}
                      disabled={updating === user.id}
                      onChange={e => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border text-sm font-medium
                         hover:bg-gray-50 disabled:opacity-40 transition"
            >
              ← Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages ||
                           Math.abs(p - page) <= 1)
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) {
                  acc.push('...');
                }
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`dots-${i}`} className="px-2 text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
                      page === p
                        ? 'bg-emerald-600 text-white'
                        : 'border hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {p}
                  </button>
                )
              )
            }

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border text-sm font-medium
                         hover:bg-gray-50 disabled:opacity-40 transition"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {[
          {
            label: 'Total Users',
            value: total,
            icon: '👥',
            color: 'bg-blue-50 text-blue-700'
          },
          {
            label: 'Admins',
            value: users.filter(u => u.role === 'admin').length,
            icon: '🛡️',
            color: 'bg-purple-50 text-purple-700'
          },
          {
            label: 'Regular Users',
            value: users.filter(u => u.role === 'user').length,
            icon: '👤',
            color: 'bg-emerald-50 text-emerald-700'
          },
        ].map(stat => (
          <div
            key={stat.label}
            className={`rounded-2xl p-5 flex items-center gap-4 ${stat.color}`}
          >
            <span className="text-3xl">{stat.icon}</span>
            <div>
              <p className="text-2xl font-extrabold">{stat.value}</p>
              <p className="text-sm font-medium opacity-80">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}