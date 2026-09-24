'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

// ── Stat Card ────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/bookings/admin/all?limit=5'),
        ]);
        setStats(statsRes.data.data);
        setBookings(bookingsRes.data.data || []);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const chartData = ['pending', 'confirmed', 'completed', 'cancelled'].map(s => ({
    status: s.charAt(0).toUpperCase() + s.slice(1),
    count: bookings.filter(b => b.status === s).length,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 rounded-xl p-6">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
            icon="👤"
            color="border-blue-500"
          />
          <StatCard
            label="Active Treks"
            value={stats.totalTreks}
            icon="🏔️"
            color="border-emerald-500"
          />
          <StatCard
            label="Total Bookings"
            value={stats.totalBookings}
            icon="📋"
            color="border-yellow-500"
          />
          <StatCard
            label="Total Revenue"
            value={`$${Number(stats.totalRevenue).toLocaleString()}`}
            icon="💰"
            color="border-purple-500"
          />
        </div>
      )}

      {/* Pending alert */}
      {stats?.pendingBookings > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-6 py-4 mb-8 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <p className="text-yellow-800 font-medium">
            You have <strong>{stats.pendingBookings}</strong> pending bookings
            that need attention.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Booking Status Overview
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Recent Bookings
          </h2>

          {bookings.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map(b => (
                <div
                  key={b.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {b.trek_title}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {b.user_name} ·{' '}
                      {new Date(b.booking_date).toLocaleDateString('en-US', {
                        dateStyle: 'medium',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-700 text-sm">
                      ${b.total_price}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        b.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : b.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : b.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}