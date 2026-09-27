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

    setTreks(prev =>
      prev.map(t =>
        t.id === trek.id
          ? { ...t, is_active: !t.is_active }
          : t
      )
    );
  };

  const deleteTrek = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    await api.delete(`/treks/${id}`);
    setTreks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                Adventure Management
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Treks
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your trekking experiences, pricing and availability.
            </p>
          </div>

          <Link
            href="/admin/treks/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <span className="text-lg leading-none">+</span>
            Add New Trek
          </Link>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Treks
              </p>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {treks.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active
              </p>
              <p className="mt-2 text-2xl font-black text-emerald-600">
                {treks.filter(t => t.is_active).length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Inactive
              </p>
              <p className="mt-2 text-2xl font-black text-slate-500">
                {treks.filter(t => !t.is_active).length}
              </p>
            </div>
          </div>
        )}

        {/* Table Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-bold text-slate-900">
                All Treks
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Keep your adventure catalog up to date.
              </p>
            </div>

            {!loading && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                {treks.length} {treks.length === 1 ? 'trek' : 'treks'}
              </span>
            )}
          </div>

          {/* Responsive table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  {[
                    'Trek',
                    'Region',
                    'Difficulty',
                    'Price',
                    'Status',
                    'Actions',
                  ].map(header => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-400"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
                        <span className="text-sm font-medium text-slate-400">
                          Loading treks...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : treks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="mx-auto max-w-sm">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                          🏔️
                        </div>

                        <h3 className="font-bold text-slate-900">
                          No treks yet
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Start building your adventure catalog by adding your first trek.
                        </p>

                        <Link
                          href="/admin/treks/new"
                          className="mt-5 inline-flex rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                        >
                          Add your first trek
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  treks.map(trek => (
                    <tr
                      key={trek.id}
                      className="group transition-colors duration-150 hover:bg-emerald-50/30"
                    >
                      {/* Trek */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-lg">
                            🏔️
                          </div>

                          <div>
                            <p className="font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
                              {trek.title}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              Trek #{trek.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Region */}
                      <td className="px-6 py-5">
                        <span className="font-medium text-slate-600">
                          {trek.region}
                        </span>
                      </td>

                      {/* Difficulty */}
                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold capitalize text-slate-600">
                          {trek.difficulty}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-5">
                        <span className="font-bold text-slate-900">
                          ${trek.price}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <button
                          onClick={() => toggleActive(trek)}
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                            trek.is_active
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              trek.is_active
                                ? 'bg-emerald-500'
                                : 'bg-slate-400'
                            }`}
                          />

                          {trek.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/treks/${trek.id}/edit`}
                            className="rounded-lg px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              deleteTrek(trek.id, trek.title)
                            }
                            className="rounded-lg px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!loading && treks.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3">
              <p className="text-xs text-slate-400">
                Showing{' '}
                <span className="font-bold text-slate-600">
                  {treks.length}
                </span>{' '}
                {treks.length === 1 ? 'trek' : 'treks'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}