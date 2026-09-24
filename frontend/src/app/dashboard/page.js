'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const statusColors = {
  pending:   'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800'
};

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading]);

  useEffect(() => {
    if (user) {
      api.get('/bookings/my')
        .then(res => setBookings(res.data.data))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const cancelBooking = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings(prev =>
        prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b)
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed.');
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Dashboard</h1>
      <p className="text-gray-500 mb-10">Welcome back, {user?.name} 👋</p>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <p className="text-5xl mb-4">🏔️</p>
          <p className="text-xl text-gray-500 mb-4">No bookings yet!</p>
          <Link href="/treks" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition">
            Browse Treks
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{booking.trek_title}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  📍 {booking.region} &nbsp;·&nbsp;
                  📅 {new Date(booking.booking_date).toLocaleDateString('en-US', { dateStyle: 'long' })} &nbsp;·&nbsp;
                  👥 {booking.num_travelers} traveler(s)
                </p>
                <p className="text-emerald-700 font-bold text-lg mt-1">${booking.total_price}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full capitalize ${statusColors[booking.status]}`}>
                  {booking.status}
                </span>
                {booking.status === 'pending' && (
                  <button
                    onClick={() => cancelBooking(booking.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold border border-red-300 px-4 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}