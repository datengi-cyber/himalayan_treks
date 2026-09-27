
// 'use client';

// import { useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';

// const navItems = [
//   { href: '/admin', label: 'Dashboard', icon: '▦' },
//   { href: '/admin/treks', label: 'Treks', icon: '⌁' },
//   { href: '/admin/bookings', label: 'Bookings', icon: '▤' },
//   { href: '/admin/users', label: 'Users', icon: '♙' },
//   { href: '/admin/reviews', label: 'Reviews', icon: '☆' },
// ];

// const SIDEBAR_WIDTH = 270;

// export default function AdminLayout({ children }) {
//   const { user, loading } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     if (!loading && (!user || user.role !== 'admin')) {
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-[#f6f7f5]">
//         <div className="flex flex-col items-center gap-3">
//           <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
//           <p className="text-sm font-medium text-slate-500">
//             Loading admin panel...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!user || user.role !== 'admin') {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-[#f6f7f5] text-slate-900">

//       {/* Sidebar */}
//       <aside
//         className="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/10 bg-[#111816] text-white shadow-2xl"
//         style={{
//           width: `${SIDEBAR_WIDTH}px`,
//         }}
//       >

//         {/* Brand */}
//         <div className="border-b border-white/10 px-6 py-6">
//           <Link
//             href="/"
//             className="group flex items-center gap-3"
//           >
//             <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-400/20 transition group-hover:bg-emerald-500/15">
//               <span className="text-xl">⌂</span>
//             </div>

//             <div className="min-w-0">
//               <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
//                 Himalaya Legacy
//               </p>

//               <h2 className="mt-0.5 truncate text-base font-semibold tracking-tight text-white">
//                 Admin Console
//               </h2>
//             </div>
//           </Link>
//         </div>

//         {/* User */}
//         <div className="px-5 pt-5">
//           <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
//             <div className="flex items-center gap-3">

//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-[#102019]">
//                 {user.name?.charAt(0)?.toUpperCase() || 'A'}
//               </div>

//               <div className="min-w-0">
//                 <p className="truncate text-sm font-semibold text-white">
//                   {user.name}
//                 </p>

//                 <div className="mt-1 flex items-center gap-1.5">
//                   <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//                   <p className="text-xs text-slate-400">
//                     Administrator
//                   </p>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <div className="px-4 pt-7">
//           <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
//             Management
//           </p>
//         </div>

//         <nav className="flex-1 space-y-1 px-4">
//           {navItems.map((item) => {
//             const active =
//               pathname === item.href ||
//               (item.href !== '/admin' &&
//                 pathname.startsWith(`${item.href}/`));

//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
//                   active
//                     ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/20'
//                     : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
//                 }`}
//               >
//                 <span
//                   className={`flex h-8 w-8 items-center justify-center rounded-lg text-base transition ${
//                     active
//                       ? 'bg-white/10 text-white'
//                       : 'bg-white/[0.04] text-slate-500 group-hover:text-emerald-400'
//                   }`}
//                 >
//                   {item.icon}
//                 </span>

//                 <span>{item.label}</span>

//                 {active && (
//                   <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
//                 )}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Bottom actions */}
//         <div className="border-t border-white/10 p-4">

//           {/* View Website */}
//           <Link
//             href="/"
//             className="mb-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-[#102019] shadow-lg shadow-emerald-950/20 transition-all duration-200 hover:bg-emerald-400 hover:shadow-emerald-900/30"
//           >
//             <span>↗</span>
//             <span>View Website</span>
//           </Link>

//           {/* Secondary back link */}
//           <Link
//             href="/"
//             className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-300"
//           >
//             ← Back to site
//           </Link>

//         </div>
//       </aside>

//       {/* Main Content */}
//       <main
//         className="min-h-screen"
//         style={{
//           marginLeft: `${SIDEBAR_WIDTH}px`,
//         }}
//       >
//         {/* Top bar */}
//         <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#f6f7f5]/90 backdrop-blur-xl">
//           <div className="flex h-16 items-center justify-between px-6 lg:px-8">

//             <div>
//               <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
//                 Himalaya Legacy
//               </p>

//               <p className="mt-0.5 text-sm font-semibold text-slate-800">
//                 Administration
//               </p>
//             </div>

//             <Link
//               href="/"
//               className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 sm:flex"
//             >
//               <span>↗</span>
//               Visit website
//             </Link>

//           </div>
//         </header>

//         {/* Page content */}
//         <div className="p-6 lg:p-8">
//           {children}
//         </div>
//       </main>

//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/treks', label: 'Treks', icon: '⌁' },
  { href: '/admin/bookings', label: 'Bookings', icon: '▤' },
  { href: '/admin/users', label: 'Users', icon: '♙' },
  { href: '/admin/reviews', label: 'Reviews', icon: '☆' },
];

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Close sidebar after navigation
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close with Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Prevent page scrolling when mobile/tablet drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7f5]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

          <p className="text-sm font-medium text-slate-500">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f7f5] text-slate-900">

      {/* =========================================================
          MOBILE / TABLET BACKDROP
      ========================================================= */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          sidebarOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      />

      {/* =========================================================
          SIDEBAR
          
          Mobile/tablet:
          - hidden off screen
          - opens as drawer

          Desktop:
          - permanently visible
          - fixed to left
      ========================================================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[270px] flex-col
          border-r border-white/10
          bg-[#111816]
          text-white
          shadow-2xl

          transition-transform
          duration-300
          ease-out

          ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }

          lg:translate-x-0
        `}
      >

        {/* Brand */}
        <div className="border-b border-white/10 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-center justify-between">

            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="group flex min-w-0 items-center gap-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-400/20 transition group-hover:bg-emerald-500/15">
                <span className="text-xl">⌂</span>
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  Himalaya Legacy
                </p>

                <h2 className="mt-0.5 truncate text-base font-semibold tracking-tight text-white">
                  Admin Console
                </h2>
              </div>
            </Link>

            {/* Close button */}
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/[0.06] hover:text-white lg:hidden"
            >
              <span className="text-xl leading-none">×</span>
            </button>

          </div>
        </div>

        {/* User */}
        <div className="px-5 pt-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-[#102019]">
                {user.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user.name}
                </p>

                <div className="mt-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <p className="text-xs text-slate-400">
                    Administrator
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Navigation title */}
        <div className="px-4 pt-7">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Management
          </p>
        </div>

        {/* Navigation */}
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-4 pb-4">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/admin' &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/20'
                    : 'text-slate-400 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base transition ${
                    active
                      ? 'bg-white/10 text-white'
                      : 'bg-white/[0.04] text-slate-500 group-hover:text-emerald-400'
                  }`}
                >
                  {item.icon}
                </span>

                <span>{item.label}</span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-white/10 p-4">

          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="mb-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-[#102019] shadow-lg shadow-emerald-950/20 transition-all duration-200 hover:bg-emerald-400"
          >
            <span>↗</span>
            <span>View Website</span>
          </Link>

          <Link
            href="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-300"
          >
            ← Back to site
          </Link>

        </div>
      </aside>

      {/* =========================================================
          DESKTOP LAYOUT SPACER

          This is what prevents content from going underneath
          the fixed sidebar.

          At desktop:
              sidebar = 270px
              content = remaining width

          At mobile/tablet:
              no spacer
      ========================================================= */}
      <div className="hidden lg:block lg:w-[270px]" />

      {/* =========================================================
          MAIN CONTENT

          IMPORTANT:
          - min-w-0 prevents children from overflowing the column
          - lg:ml-[270px] is intentionally NOT used
      ========================================================= */}
      <main className="min-w-0 lg:ml-[270px]">

        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#f6f7f5]/90 backdrop-blur-xl">

          <div className="flex h-16 min-w-0 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

            {/* Menu + title */}
            <div className="flex min-w-0 items-center gap-3">

              {/* Mobile / tablet */}
              <button
                type="button"
                aria-label="Open navigation"
                aria-expanded={sidebarOpen}
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 lg:hidden"
              >
                <span className="text-xl leading-none">
                  ☰
                </span>
              </button>

              <div className="min-w-0">
                <p className="truncate text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
                  Himalaya Legacy
                </p>

                <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                  Administration
                </p>
              </div>

            </div>

            {/* Website */}
            <Link
              href="/"
              className="hidden shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 sm:flex"
            >
              <span>↗</span>
              <span>Visit website</span>
            </Link>

          </div>
        </header>

        {/* =======================================================
            PAGE CONTENT

            min-w-0 is extremely important here.
        ======================================================= */}
        <div className="min-w-0 p-4 sm:p-6 lg:p-8">
          {children}
        </div>

      </main>

    </div>
  );
}