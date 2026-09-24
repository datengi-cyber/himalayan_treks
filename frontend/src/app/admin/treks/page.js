'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminTreksPage() {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/treks?limit=100').then(r => {
      setTreks(r.data.data);
      setLoading(false);
    });
  }, []);

  const toggleActive = async (trek) => {
    await api.put(`/treks/${trek.id}`, { is_active: !trek.is_active });
    setTreks(prev => prev.map(t =>
      t.id === trek.id ? { ...t, is_active: !t.is_active } : t
    ));
  };

  const deleteTrek = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await api.delete(`/treks/${id}`);
    setTreks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Treks</h1>
        <Link
          href="/admin/treks/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition"
        >
          + Add New Trek
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Trek', 'Region', 'Difficulty', 'Price', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-4 text-left font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400">Loading...</td></tr>
            ) : treks.map(trek => (
              <tr key={trek.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">{trek.title}</td>
                <td className="px-6 py-4 text-gray-500">{trek.region}</td>
                <td className="px-6 py-4 capitalize text-gray-500">{trek.difficulty}</td>
                <td className="px-6 py-4 font-medium text-emerald-700">${trek.price}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleActive(trek)}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      trek.is_active
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {trek.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/treks/${trek.id}/edit`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteTrek(trek.id, trek.title)}
                      className="text-red-500 hover:text-red-700 font-medium"
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
    </div>
  );
}