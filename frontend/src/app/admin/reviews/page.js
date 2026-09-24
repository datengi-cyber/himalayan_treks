'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('false'); // default: show pending

  useEffect(() => {
    api.get(`/reviews/admin/all?approved=${filter}`)
      .then(r => setReviews(r.data.data));
  }, [filter]);

  const handleApprove = async (id, approve) => {
    await api.put(`/reviews/admin/${id}/approve`, { is_approved: approve });
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    await api.delete(`/reviews/${id}`);
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Reviews</h1>

      <div className="flex gap-3 mb-6">
        {[['false','Pending Approval'],['true','Approved']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              filter === val
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {reviews.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl text-gray-400">
            No reviews in this category.
          </div>
        )}
        {reviews.map(review => (
          <div key={review.id} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-gray-900">{review.user_name}</span>
                  <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                  <span className="text-gray-400 text-sm">on {review.trek_title}</span>
                </div>
                {review.title && (
                  <p className="font-semibold text-gray-800 mb-1">{review.title}</p>
                )}
                <p className="text-gray-600 text-sm">{review.comment}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(review.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-6">
                {filter === 'false' && (
                  <button
                    onClick={() => handleApprove(review.id, true)}
                    className="bg-green-100 text-green-700 hover:bg-green-200 font-semibold px-4 py-2 rounded-lg text-sm transition"
                  >
                    ✓ Approve
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  className="bg-red-100 text-red-600 hover:bg-red-200 font-semibold px-4 py-2 rounded-lg text-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}