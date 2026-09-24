
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/admin', label: '📊 Dashboard' },
  { href: '/admin/treks', label: '🏔️ Treks' },
  { href: '/admin/bookings', label: '📋 Bookings' },
  { href: '/admin/users', label: '👤 Users' },
  { href: '/admin/reviews', label: '⭐ Reviews' },
];

const HEADER_HEIGHT = 80; // your website header height
const SIDEBAR_WIDTH = 256; // w-64 = 16rem = 256px

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* sidebar */}
      <aside
        className="fixed left-0 bg-gray-900 text-white z-40"
        style={{
          top: `${HEADER_HEIGHT}px`,
          width: `${SIDEBAR_WIDTH}px`,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-emerald-400">
            🏔️ Admin Panel
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {user.name}
          </p>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg transition ${
                pathname === item.href
                  ? 'bg-emerald-600'
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700 mt-auto">
          <Link href="/">← Back to Website</Link>
        </div>
      </aside>

      {/* content */}
      <div
        style={{
          paddingTop: `${HEADER_HEIGHT + 24}px`,
          paddingLeft: `${SIDEBAR_WIDTH + 24}px`,
          paddingRight: '24px',
          paddingBottom: '24px',
          minHeight: '100vh',
        }}
      >
        {children}
      </div>
    </div>
  );
}