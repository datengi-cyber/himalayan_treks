'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

const statusColors = {
  pending:   'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = filter ? `/bookings/admin/all?status=${filter}` : '/bookings/admin/all';
    api.get(url).then(r => {
      setBookings(r.data.data);
      setLoading(false);
    });
  }, [filter]);

  const updateStatus = async (id, status) => {
    await api.put(`/bookings/admin/${id}/status`, { status });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Bookings</h1>

      {/* Filter */}
      <div className="flex gap-3 mb-6">
        {['', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition capitalize ${
              filter === s
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['#', 'Trek', 'User', 'Date', 'Travelers', 'Total', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-5 py-4 text-left font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={8} className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : bookings.map(b => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 text-gray-400">#{b.id}</td>
                <td className="px-5 py-4 font-semibold text-gray-900">{b.trek_title}</td>
                <td className="px-5 py-4">
                  <p className="text-gray-900">{b.user_name}</p>
                  <p className="text-gray-400 text-xs">{b.user_email}</p>
                </td>
                <td className="px-5 py-4 text-gray-500">
                  {new Date(b.booking_date).toLocaleDateString()}
                </td>
                <td className="px-5 py-4 text-gray-500">{b.num_travelers}</td>
                <td className="px-5 py-4 font-bold text-emerald-700">${b.total_price}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColors[b.status]}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <select
                    className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none"
                    value={b.status}
                    onChange={e => updateStatus(b.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}