'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Image from "next/image";

const expeditionCategories = [
  {
    id: 'everest',
    name: 'Everest Region',
    tagline: 'Roof of the World',
    subs: [
      { name: 'Everest Base Camp Trek', href: '/treks/everest-base-camp' },
      { name: 'Everest Three Passes', href: '/treks/everest-three-passes' },
      { name: 'Gokyo Lakes Trek', href: '/treks/gokyo-lakes' },
      { name: 'Everest View Trek', href: '/treks/everest-view' },
      { name: 'Island Peak Climbing', href: '/treks/island-peak' },
    ],
    promos: [
      {
        name: 'Everest Base Camp',
        subtitle: '5,364m · 14 Days',
        img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        href: '/treks/everest-base-camp',
      },
      {
        name: 'Gokyo Ri Sunrise',
        subtitle: '5,357m · 12 Days',
        img: 'https://images.unsplash.com/photo-1544986581-efac024faf62?q=80&w=800&auto=format&fit=crop',
        href: '/treks/gokyo-lakes',
      },
    ],
  },
  {
    id: 'annapurna',
    name: 'Annapurna Region',
    tagline: 'Sanctuary of Giants',
    subs: [
      { name: 'Annapurna Circuit', href: '/treks/annapurna-circuit' },
      { name: 'Annapurna Base Camp', href: '/treks/annapurna-base-camp' },
      { name: 'Poon Hill Trek', href: '/treks/poon-hill' },
      { name: 'Mardi Himal Trek', href: '/treks/mardi-himal' },
      { name: 'Khopra Ridge Trek', href: '/treks/khopra-ridge' },
    ],
    promos: [
      {
        name: 'Annapurna Circuit',
        subtitle: '5,416m · 16 Days',
        img: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=800&auto=format&fit=crop',
        href: '/treks/annapurna-circuit',
      },
      {
        name: 'Annapurna Sanctuary',
        subtitle: '4,130m · 10 Days',
        img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        href: '/treks/annapurna-base-camp',
      },
    ],
  },
  {
    id: 'langtang',
    name: 'Langtang Region',
    tagline: 'Valley of Glaciers',
    subs: [
      { name: 'Langtang Valley Trek', href: '/treks/langtang-valley' },
      { name: 'Gosaikunda Lake Trek', href: '/treks/gosaikunda' },
      { name: 'Tamang Heritage Trail', href: '/treks/tamang-heritage' },
      { name: 'Helambu Circuit', href: '/treks/helambu-circuit' },
    ],
    promos: [
      {
        name: 'Langtang Valley',
        subtitle: '3,870m · 8 Days',
        img: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop',
        href: '/treks/langtang-valley',
      },
      {
        name: 'Gosaikunda Lakes',
        subtitle: '4,380m · 9 Days',
        img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop',
        href: '/treks/gosaikunda',
      },
    ],
  },
  {
    id: 'manaslu',
    name: 'Manaslu Region',
    tagline: 'The Hidden Giant',
    subs: [
      { name: 'Manaslu Circuit Trek', href: '/treks/manaslu-circuit' },
      { name: 'Tsum Valley Trek', href: '/treks/tsum-valley' },
      { name: 'Manaslu Base Camp', href: '/treks/manaslu-base-camp' },
    ],
    promos: [
      {
        name: 'Manaslu Circuit',
        subtitle: '5,106m · 15 Days',
        img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop',
        href: '/treks/manaslu-circuit',
      },
      {
        name: 'Tsum Valley',
        subtitle: '3,700m · 12 Days',
        img: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=800&auto=format&fit=crop',
        href: '/treks/tsum-valley',
      },
    ],
  },
  {
    id: 'mustang',
    name: 'Mustang & Dolpo',
    tagline: 'The Forbidden Kingdom',
    subs: [
      { name: 'Upper Mustang Trek', href: '/treks/upper-mustang' },
      { name: 'Lower Dolpo Trek', href: '/treks/lower-dolpo' },
      { name: 'Shey Gompa Trek', href: '/treks/shey-gompa' },
    ],
    promos: [
      {
        name: 'Upper Mustang',
        subtitle: '3,800m · 11 Days',
        img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
        href: '/treks/upper-mustang',
      },
      {
        name: 'Lower Dolpo',
        subtitle: '5,200m · 18 Days',
        img: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop',
        href: '/treks/lower-dolpo',
      },
    ],
  },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(expeditionCategories[0].id);
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  const activeData =
    expeditionCategories.find((c) => c.id === activeCategory) || expeditionCategories[0];

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        :root {
          --gold: #C9A96E;
          --gold-light: #E8D5B0;
          --slate: #0D1117;
          --white: #FAFAF8;
          --white-60: rgba(250,250,248,0.6);
          --navy: #192851;
          --navy-light: #223269;
          --font-display: 'Cormorant Garamond', Georgia, serif;
          --font-body: 'DM Sans', system-ui, sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: var(--font-body); }

        .ht-navbar {
          background: #192851;
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 0 3rem;
          height: 100px;
          display: flex; align-items: center; justify-content: space-between;
          transition: all 0.5s cubic-bezier(0.16,1,0.3,1);
        }
        .ht-navbar.scrolled {
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 0.5px solid rgba(201,169,110,0.2);
          height: 80px;
        }
        .ht-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        
        .ht-logo-mark {
          width: 82px;
          height: 82px;
          object-fit: contain;
          flex-shrink: 0;
        }
        
        .ht-logo-name {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--white);
          letter-spacing: 0.04em;
          line-height: 1;
          display: block;
        }
        
        .ht-logo-sub {
          font-size: 0.6rem;
          font-weight: 400;
          color: var(--gold);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          display: block;
          margin-top: 2px;
        }

        .ht-nav-links {
          display: flex; align-items: center; gap: 2.5rem; list-style: none;
           padding: 0.75rem 1.5rem;
          border-radius: 100px; border: 1px solid rgb(17, 8, 135);
        }
        .ht-nav-links > li { position: relative; display: flex; align-items: center; }
        .ht-nav-links a {
          font-size: 0.75rem; font-weight: 500;
          color:  #ffffff; text-decoration: none;
          letter-spacing: 0.10em; text-transform: uppercase;
          position: relative; transition: color 0.3s;
          display: flex; align-items: center; gap: 0.35rem;
        }
        .ht-nav-links a::after {
          content: '';
          position: absolute; bottom: -4px; left: 0; right: 0;
          height: 1px; background: var(--gold);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .ht-nav-links a:hover { color: var(--white); }
        .ht-nav-links a:hover::after { transform: scaleX(1); }
        .ht-nav-caret {
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .ht-nav-item-mega.mega-active .ht-nav-caret { transform: rotate(180deg); }
        .ht-nav-item-mega.mega-active > a { color: var(--white); }

        .ht-nav-actions { display: flex; align-items: center; gap: 1rem; }

        .ht-btn-ghost {
          font-size: 0.75rem; font-weight: 500;
          color:  #ffffff; text-decoration: none;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 0.5rem 1rem; transition: color 0.3s;
           border: 1px solid rgba(68, 46, 164, 0.83);
          cursor: pointer;
          border-radius: 100px;
        }
        .ht-btn-ghost:hover { color: var(--white); }
        .ht-btn-primary {
          display: inline-block;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        
          padding: 0.75rem 1.8rem;
          border: 1px solid var(--gold);
          border-radius: 999px; /* Fully rounded */
        
          background: transparent; /* No background */
          color: #fff;
        
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
        
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .ht-btn-primary::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.08); /* Subtle hover overlay */
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .ht-btn-primary:hover::before {
          transform: translateX(0);
        }
        
        .ht-btn-primary span {
          position: relative;
          z-index: 1;
          color: #fff;
        }
        
        .ht-btn-primary:hover {
          border-color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .ht-btn-primary:hover span {
          color: #fff;
        }
        .ht-mobile-btn {
          display: none; background: none; border: none; cursor: pointer;
          color: var(--white); padding: 0.5rem;
        }

        .ht-mobile-menu {
          display: none; flex-direction: column;
          position: absolute; top: 100%; left: 0; right: 0;
          background: rgba(13,17,23,0.97);
          backdrop-filter: blur(20px);
          border-bottom: 0.5px solid rgba(201,169,110,0.2);
          padding: 1.5rem 2rem 2rem;
          gap: 0;
        }
        .ht-mobile-menu.open { display: flex; }
        .ht-mobile-menu a, .ht-mobile-menu button {
          font-size: 0.8rem; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--white-60);
          text-decoration: none; padding: 1rem 0;
          border-bottom: 0.5px solid rgba(201,169,110,0.1);
          transition: color 0.3s; background: none; border-left: none;
          border-right: none; border-top: none; cursor: pointer;
          text-align: left;
        }
        .ht-mobile-menu a:hover, .ht-mobile-menu button:hover { color: var(--gold); }
        .ht-mobile-menu .ht-mobile-cta {
          margin-top: 1.5rem;
          background: var(--gold); color: var(--slate);
          border: none; padding: 1rem 1.5rem;
          font-size: 0.75rem; letter-spacing: 0.15em;
          font-weight: 500; text-align: center;
        }
        .ht-mobile-menu .ht-mobile-cta:hover { color: var(--slate); }

        /* ═══════════════════════════════════════════════════
           MEGA MENU — Expeditions
        ═══════════════════════════════════════════════════ */
        .ht-mega-wrap {
          position: fixed;
          left: 0; right: 0;
          background: var(--navy);
          z-index: 99;
          border-top: 0.5px solid rgba(201,169,110,0.18);
          border-bottom: 1px solid rgba(201,169,110,0.28);
          box-shadow: 0 30px 60px rgba(0,0,0,0.35);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-12px);
          transition: opacity 0.35s cubic-bezier(0.16,1,0.3,1),
                      transform 0.35s cubic-bezier(0.16,1,0.3,1),
                      top 0.5s cubic-bezier(0.16,1,0.3,1),
                      visibility 0s linear 0.35s;
          pointer-events: none;
        }
        .ht-mega-wrap.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          pointer-events: auto;
          transition: opacity 0.35s cubic-bezier(0.16,1,0.3,1),
                      transform 0.35s cubic-bezier(0.16,1,0.3,1),
                      top 0.5s cubic-bezier(0.16,1,0.3,1),
                      visibility 0s;
        }

        .ht-mega-inner {
          display: grid;
          grid-template-columns: 280px 1fr 460px;
          max-width: 1440px;
          margin: 0 auto;
          min-height: 420px;
        }

        /* ── LEFT: CATEGORIES ── */
        .ht-mega-categories {
          padding: 3rem 1rem 3rem 3rem;
          border-right: 1px solid rgba(201,169,110,0.14);
          display: flex; flex-direction: column;
        }
        .ht-mega-col-label {
          font-family: var(--font-body);
          font-size: 0.62rem; font-weight: 500;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(250,250,248,0.35);
          margin-bottom: 1.5rem;
        }
        .ht-mega-cat-btn {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; text-align: left;
          background: none; border: none; cursor: pointer;
          padding: 0.9rem 0.9rem 0.9rem 1rem;
          margin-bottom: 0.35rem;
          border-radius: 6px;
          border-left: 2px solid transparent;
          color: rgba(250,250,248,0.68);
          transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
        .ht-mega-cat-btn:hover {
          background: rgba(255,255,255,0.04);
          color: var(--white);
        }
        .ht-mega-cat-btn.active {
          background: rgba(201,169,110,0.10);
          border-left-color: var(--gold);
          color: var(--gold-light);
        }
        .ht-mega-cat-name {
          font-family: var(--font-body);
          font-size: 0.78rem; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .ht-mega-cat-tagline {
          display: block;
          font-family: var(--font-display);
          font-style: italic;
          font-size: 0.78rem;
          font-weight: 400;
          letter-spacing: 0.01em;
          text-transform: none;
          color: rgba(250,250,248,0.4);
          margin-top: 0.2rem;
        }
        .ht-mega-cat-btn.active .ht-mega-cat-tagline { color: rgba(232,213,176,0.6); }
        .ht-mega-cat-arrow {
          color: var(--gold);
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          flex-shrink: 0;
        }
        .ht-mega-cat-btn.active .ht-mega-cat-arrow,
        .ht-mega-cat-btn:hover .ht-mega-cat-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* ── CENTER: SUB-EXPEDITIONS ── */
        .ht-mega-subs {
          padding: 3rem 2.5rem;
          border-right: 1px solid rgba(201,169,110,0.14);
        }
        .ht-mega-subs-heading {
          font-family: var(--font-display);
          font-size: 1.6rem; font-weight: 400; font-style: italic;
          color: var(--white);
          margin-bottom: 0.35rem;
        }
        .ht-mega-subs-heading b { font-style: normal; color: var(--gold); font-weight: 600; }
        .ht-mega-subs-sub {
          font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(250,250,248,0.4);
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(201,169,110,0.14);
        }
        .ht-mega-sub-list {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.25rem 1.5rem;
        }
        .ht-mega-sub-list li a {
          display: flex; align-items: center; gap: 0.65rem;
          padding: 0.85rem 0.25rem;
          font-size: 0.8rem; font-weight: 400;
          letter-spacing: 0.02em;
          color: rgba(250,250,248,0.72);
          text-decoration: none;
          border-bottom: 0.5px solid rgba(255,255,255,0.06);
          transition: color 0.3s ease, padding-left 0.3s ease;
        }
        .ht-mega-sub-list li a::before {
          content: '';
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--gold);
          flex-shrink: 0;
          opacity: 0.5;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .ht-mega-sub-list li a:hover {
          color: var(--white);
          padding-left: 0.6rem;
        }
        .ht-mega-sub-list li a:hover::before {
          opacity: 1;
          transform: scale(1.3);
        }
        .ht-mega-view-all {
          display: inline-flex; align-items: center; gap: 0.6rem;
          margin-top: 2rem;
          font-size: 0.68rem; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--gold);
          text-decoration: none;
          border-bottom: 1px solid rgba(201,169,110,0.4);
          padding-bottom: 3px;
          transition: border-color 0.3s ease, gap 0.3s ease;
        }
        .ht-mega-view-all:hover { border-color: var(--gold); gap: 0.9rem; }

        /* ── RIGHT: PROMO CARDS ── */
        .ht-mega-promos {
          padding: 3rem 3rem 3rem 2.5rem;
          display: flex; flex-direction: column; gap: 1.25rem;
        }
        .ht-mega-promo-card {
          position: relative;
          flex: 1;
          border-radius: 10px;
          overflow: hidden;
          text-decoration: none;
          display: block;
          min-height: 165px;
          box-shadow: 0 12px 28px rgba(0,0,0,0.28);
        }
        .ht-mega-promo-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .ht-mega-promo-card:hover .ht-mega-promo-img { transform: scale(1.08); }
        .ht-mega-promo-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(13,17,23,0.05) 30%, rgba(13,17,23,0.88) 100%);
        }
        .ht-mega-promo-body {
          position: absolute; left: 0; right: 0; bottom: 0; z-index: 2;
          padding: 1.25rem 1.4rem;
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 0.75rem;
        }
        .ht-mega-promo-name {
          font-family: var(--font-display);
          font-size: 1.25rem; font-weight: 600;
          color: var(--white); line-height: 1.15; margin-bottom: 0.25rem;
        }
        .ht-mega-promo-sub {
          font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold-light);
        }
        .ht-mega-promo-cta {
          flex-shrink: 0;
          width: 34px; height: 34px; border-radius: 50%;
          border: 1px solid rgba(250,250,248,0.4);
          display: flex; align-items: center; justify-content: center;
          color: var(--white);
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }
        .ht-mega-promo-card:hover .ht-mega-promo-cta {
          background: var(--gold);
          border-color: var(--gold);
          color: var(--slate);
          transform: translateX(3px);
        }

        @media (max-width: 1200px) {
          .ht-mega-inner { grid-template-columns: 240px 1fr 380px; }
        }

        @media (max-width: 768px) {
          .ht-navbar { padding: 0 1.5rem; position: relative; }
          .ht-nav-links, .ht-nav-actions { display: none; }
          .ht-mobile-btn { display: flex; align-items: center; justify-content: center; }
          .ht-mega-wrap { display: none; }
        }
      `}</style>

      <nav className={`ht-navbar${scrolled ? ' scrolled' : ''}`}>
        {/* Logo */}
      <Link href="/" className="ht-logo">
        <Image
          src="/newLOgofor-removebg-preview.png"
          alt="Himalaya Legacy Logo"
          width={100}
          height={100}
          className="ht-logo-mark"
          priority
        />
      
        <div>
          <span className="ht-logo-name">Himalaya Legacy</span>
          {/* <span className="ht-logo-sub">Est. 2009 · Nepal</span> */}
        </div>
      </Link>

        {/* Desktop Links */}
        <ul className="ht-nav-links">
          <li
            className={`ht-nav-item-mega${megaOpen ? ' mega-active' : ''}`}
            onMouseEnter={openMega}
            onMouseLeave={scheduleClose}
          >
            <Link href="/treks">
              Expeditions
              <svg className="ht-nav-caret" width="9" height="6" viewBox="0 0 9 6" fill="none">
                <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </li>
          <li><Link href="/treks">Treks</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>

        {/* Desktop Actions */}
        <div className="ht-nav-actions">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin" className="ht-btn-ghost" style={{ color: 'var(--gold)' }}>Admin</Link>
              )}
              <Link href="/dashboard" className="ht-btn-ghost">My Bookings</Link>
              <button onClick={logout} className="ht-btn-primary"><span>Logout</span></button>
            </>
          ) : (
            <>
              <Link href="/login" className="ht-btn-ghost">Login</Link>
              <Link href="/register" className="ht-btn-primary"><span>Book a Trek</span></Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="ht-mobile-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 6h16M4 12h16M4 18h10"/>
            </svg>
          )}
        </button>

        {/* Mobile Menu */}
        <div className={`ht-mobile-menu${menuOpen ? ' open' : ''}`}>
          <Link href="/treks" onClick={() => setMenuOpen(false)}>Expeditions</Link>
          <Link href="/treks" onClick={() => setMenuOpen(false)}>Treks</Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>My Bookings</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" className="ht-mobile-cta" onClick={() => setMenuOpen(false)}>Book a Trek</Link>
            </>
          )}
        </div>
      </nav>

      {/* ═══ MEGA MENU — EXPEDITIONS ═══ */}
      <div
        className={`ht-mega-wrap${megaOpen ? ' open' : ''}`}
        style={{ top: scrolled ? '80px' : '100px' }}
        onMouseEnter={openMega}
        onMouseLeave={scheduleClose}
      >
        <div className="ht-mega-inner">
          {/* LEFT — Categories */}
          <div className="ht-mega-categories">
            <span className="ht-mega-col-label">Explore By Region 1</span>
            {expeditionCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`ht-mega-cat-btn${cat.id === activeCategory ? ' active' : ''}`}
                onMouseEnter={() => setActiveCategory(cat.id)}
                onFocus={() => setActiveCategory(cat.id)}
              >
                <span>
                  <span className="ht-mega-cat-name">{cat.name}</span>
                  <span className="ht-mega-cat-tagline">{cat.tagline}</span>
                </span>
                <svg className="ht-mega-cat-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>

          {/* CENTER — Sub-expeditions for active category */}
          <div className="ht-mega-subs">
            <h3 className="ht-mega-subs-heading">
              <b>{activeData.name}</b> Treks
            </h3>
            <p className="ht-mega-subs-sub">{activeData.tagline}</p>
            <ul className="ht-mega-sub-list">
              {activeData.subs.map((sub) => (
                <li key={sub.href}>
                  <Link href={sub.href} onClick={() => setMegaOpen(false)}>
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={`/treks?region=${activeData.id}`}
              className="ht-mega-view-all"
              onClick={() => setMegaOpen(false)}
            >
              View All {activeData.name} Treks
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* RIGHT — Promo Cards */}
          <div className="ht-mega-promos">
            {activeData.promos.map((promo) => (
              <Link
                key={promo.name}
                href={promo.href}
                className="ht-mega-promo-card"
                onClick={() => setMegaOpen(false)}
              >
                <img className="ht-mega-promo-img" src={promo.img} alt={promo.name} />
                <div className="ht-mega-promo-gradient" />
                <div className="ht-mega-promo-body">
                  <div>
                    <div className="ht-mega-promo-name">{promo.name}</div>
                    <span className="ht-mega-promo-sub">{promo.subtitle}</span>
                  </div>
                  <span className="ht-mega-promo-cta">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}