

'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import TrekCard from '@/components/TrekCard';
import api from '@/lib/api';
import HimalayanExpeditionMap from '@/components/HimalayanExpeditionMap';

const REGIONS = [
  { label: 'Everest', value: 'everest' },
  { label: 'Annapurna', value: 'annapurna' },
  { label: 'Langtang', value: 'langtang' },
];
const DIFFICULTIES = ['easy', 'moderate', 'challenging', 'extreme'];
const DIFFICULTY_LABELS = { easy: 'Easy', moderate: 'Moderate', challenging: 'Challenging', extreme: 'Extreme' };

const PAGE_LIMIT = 10;

const STATS = [
  { value: '180+', label: 'Curated Routes' },
  { value: '6100m', label: 'Avg Peak Altitude' },
  { value: '4.9★', label: 'Guide Rating' },
  { value: '12K+', label: 'Adventurers Served' },
];

export default function TreksPage() {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);       // initial / filter-change load
  const [loadingMore, setLoadingMore] = useState(false); // "Load More" load
  const [error, setError] = useState(null);            // initial load error
  const [loadMoreError, setLoadMoreError] = useState(null); // load-more error
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 1 });
  const [filters, setFilters] = useState({ region: '', difficulty: '', search: '' });
  const [heroVisible, setHeroVisible] = useState(false);
  const heroRef = useRef(null);

  // Guards against race conditions: only the most recently issued request
  // is allowed to update state when it resolves.
  const requestIdRef = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fetchTreks = useCallback(async (pageNum, { replace = false } = {}) => {
    const requestId = ++requestIdRef.current;

    if (replace) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
      setLoadMoreError(null);
    }

    try {
      const params = new URLSearchParams();
      params.append('page', String(pageNum));
      params.append('limit', String(PAGE_LIMIT));
      if (filters.region) params.append('region', filters.region);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.search) params.append('search', filters.search);

      const url = `/treks?${params.toString()}`;
      let res;
      if (typeof api?.get === 'function') res = await api.get(url);
      else if (typeof api?.default?.get === 'function') res = await api.default.get(url);
      else throw new Error('api.get is not a function');

      // Stale response from a superseded request — ignore it.
      if (requestId !== requestIdRef.current) return;

      const newTreks = res.data.data || [];
      const newPagination = res.data.pagination || {
        total: newTreks.length,
        page: pageNum,
        limit: PAGE_LIMIT,
        totalPages: pageNum,
      };

      setTreks(prev => (replace ? newTreks : [...prev, ...newTreks]));
      setPagination(newPagination);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      console.error('FETCH ERROR:', err);
      if (replace) {
        setError('Unable to load treks right now.');
        setTreks([]);
      } else {
        setLoadMoreError('Unable to load more treks.');
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.region, filters.difficulty, filters.search]);

  // Filters/search changing always resets to page 1 and replaces the list.
  useEffect(() => {
    fetchTreks(1, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.region, filters.difficulty, filters.search]);

  const handleLoadMore = () => {
    if (loadingMore || loading) return;
    fetchTreks(pagination.page + 1, { replace: false });
  };

  const hasMore = pagination.page < pagination.totalPages;
  const totalTreks = pagination.total ?? treks.length;
  const regionLabel = REGIONS.find(r => r.value === filters.region)?.label;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&family=Inter:wght@400;500;600;700&display=swap');

        .treks-root {
          background: #ffffff;
          min-height: 100vh;
          font-family: 'Outfit', sans-serif;
          color: #070707;
          overflow-x: hidden;
        }
        .hero {
          position: relative;
          height: 88vh;
          min-height: 600px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 6vw 72px;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 120% 60% at 60% 40%, rgba(180,130,60,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 80% 80% at 20% 80%, rgba(30,60,90,0.35) 0%, transparent 60%),
            linear-gradient(175deg, #0d1520 0%, #080c10 55%, #060a0e 100%);
          z-index: 0;
        }

        .hero-mountains {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
        }

        .hero-mountains svg {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: auto;
        }

        .hero-grain {
          position: absolute;
          inset: 0;
          z-index: 2;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 128px;
        }

        .hero-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(198,155,80,0.4) 40%, rgba(198,155,80,0.4) 60%, transparent);
          z-index: 10;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 780px;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .hero-content.visible { opacity: 1; transform: translateY(0); }

        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.7s 0.15s ease, transform 0.7s 0.15s ease;
        }
        .hero-eyebrow.visible { opacity: 1; transform: translateY(0); }

        .eyebrow-line {
          width: 40px; height: 1px;
          background: linear-gradient(90deg, rgba(198,155,80,0.8), rgba(198,155,80,0.2));
        }

        .eyebrow-text {
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(198,155,80,0.85);
          font-weight: 500;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(52px, 7vw, 96px);
          line-height: 0.95;
          letter-spacing: -0.01em;
          color: #f0e8d8;
          margin: 0 0 8px;
        }

        .hero-title em {
          font-style: italic;
          color: rgba(198,155,80,0.9);
        }

        .hero-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(18px, 2.2vw, 28px);
          font-weight: 300;
          font-style: italic;
          color: rgba(224,212,192,0.55);
          margin: 16px 0 0;
          letter-spacing: 0.01em;
        }

        /* ── STATS BAR ──────────────────────── */
        .stats-bar {
          position: relative;
          z-index: 20;
          display: flex;
          gap: 0;
          border-top: 1px solid rgba(198,155,80,0.15);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(12,17,24,0.95);
          backdrop-filter: blur(12px);
          overflow: hidden;
        }

        .stat-item {
          flex: 1;
          padding: 22px 0;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.05);
          transition: background 0.3s ease;
        }
        .stat-item:last-child { border-right: none; }
        .stat-item:hover { background: rgba(198,155,80,0.04); }

        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 400;
          color: rgba(198,155,80,0.92);
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(200,190,175,0.4);
          font-weight: 400;
        }

        /* ── LISTING WRAP ─────────────────────── */
        /* Everything from the filters down to Load More sits on a soft
           neutral surface with a comfortable, capped reading width. */
        .listing-surface {
          background: #F8FAFC;
        }
        .listing-inner {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── FILTERS ─────────────────────────── */
        .filters-section {
          padding: 40px 0 0;
          position: relative;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        .filters-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .filters-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .trek-count {
          font-size: 14px;
          color: #64748B;
        }

        .filters-row {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 12px;
          align-items: center;
        }

        @media (max-width: 700px) {
          .filters-row { grid-template-columns: 1fr; }
        }

        .search-wrap {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
          font-size: 15px;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          color: #111827;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          font-size: 14px;
          padding: 13px 16px 13px 44px;
          border-radius: 10px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .search-input::placeholder { color: #94A3B8; }
        .search-input:focus {
          border-color: #048BFF;
          box-shadow: 0 0 0 3px #EAF5FF;
        }

        .filter-pill-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-pill {
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid #E5E7EB;
          background: #FFFFFF;
          color: #334155;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .filter-pill:hover {
          border-color: #048BFF;
          color: #048BFF;
          background: #EAF5FF;
        }
        .filter-pill.active {
          border-color: #048BFF;
          background: #048BFF;
          color: #FFFFFF;
        }
        .filter-pill:focus-visible {
          outline: 2px solid #048BFF;
          outline-offset: 2px;
        }

        /* ── ACTIVE FILTERS STRIP ────────────── */
        .active-filters {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 0 0;
          flex-wrap: wrap;
          min-height: 0;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        .active-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px 5px 14px;
          background: #EAF5FF;
          border: 1px solid #BFE0FF;
          border-radius: 999px;
          font-size: 12.5px;
          color: #0369A1;
        }

        .active-tag button {
          background: none;
          border: none;
          color: #048BFF;
          cursor: pointer;
          font-size: 14px;
          line-height: 1;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .active-tag button:hover { color: #0078E6; }

        .clear-all {
          background: none;
          border: none;
          color: #64748B;
          cursor: pointer;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          font-size: 12.5px;
          padding: 5px 10px;
          transition: color 0.2s;
        }
        .clear-all:hover { color: #111827; }

        /* ── DIVIDER ─────────────────────────── */
        .section-divider {
          margin: 32px 0 0;
          height: 1px;
          background: #E5E7EB;
        }

        /* ── GRID ────────────────────────────── */
        .grid-section {
          padding: 32px 0 80px;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        .grid-label {
          font-size: 14px;
          color: #64748B;
          margin-bottom: 20px;
          font-weight: 400;
        }

        .treks-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: stretch;
        }
        @media (min-width: 768px) {
          .treks-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (min-width: 1100px) {
          .treks-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }

        /* ── SKELETON ────────────────────────── */
        .skeleton-card {
          border-radius: 20px;
          overflow: hidden;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
        }

        .skeleton-img {
          aspect-ratio: 16 / 9;
          background: linear-gradient(100deg, #EEF2F7 30%, #E2E8F0 50%, #EEF2F7 70%);
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite;
        }

        .skeleton-body { padding: 18px 20px 20px; }

        .skeleton-line {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(100deg, #EEF2F7 30%, #E2E8F0 50%, #EEF2F7 70%);
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite;
          margin-bottom: 10px;
        }
        @media (prefers-reduced-motion: reduce) {
          .skeleton-img, .skeleton-line { animation: none; }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* ── EMPTY STATE ─────────────────────── */
        .empty-state {
          text-align: center;
          padding: 100px 20px;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        .empty-icon {
          font-size: 40px;
          color: #CBD5E1;
          margin-bottom: 16px;
          display: block;
        }

        .empty-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
        }

        .empty-sub {
          font-size: 13.5px;
          color: #64748B;
        }

        /* ── ERROR STATE ─────────────────────── */
        .error-state {
          text-align: center;
          padding: 100px 20px;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }

        .error-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 12px;
        }

        .retry-btn {
          height: 44px;
          padding: 0 24px;
          border-radius: 11px;
          border: none;
          background: #048BFF;
          color: #FFFFFF;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .retry-btn:hover { background: #0078E6; }
        .retry-btn:focus-visible {
          outline: 2px solid #048BFF;
          outline-offset: 2px;
        }

        /* ── LOAD MORE SECTION ───────────────── */
        .load-more-section {
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid #E5E7EB;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
        }

        .load-more-count {
          font-size: 14px;
          color: #64748B;
        }

        .load-more-btn {
          height: 50px;
          min-width: 200px;
          padding: 0 32px;
          border: none;
          border-radius: 13px;
          background: #048BFF;
          color: #FFFFFF;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .load-more-btn:hover:not(:disabled) {
          background: #0078E6;
        }
        .load-more-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .load-more-btn:disabled {
          cursor: default;
          opacity: 0.85;
        }
        .load-more-btn:focus-visible {
          outline: 2px solid #048BFF;
          outline-offset: 2px;
        }

        .load-more-spinner {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #FFFFFF;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .load-more-spinner { animation: none; }
        }

        .load-more-error {
          font-size: 13.5px;
          color: #B91C1C;
        }

        .load-more-retry {
          background: none;
          border: none;
          text-decoration: underline;
          cursor: pointer;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          color: #048BFF;
          margin-left: 6px;
        }

        .end-message {
          font-size: 14px;
          color: #94A3B8;
        }
      `}</style>

      <div className="treks-root">

        {/* ── HERO ── */}
        <div className="hero" ref={heroRef}>
          <div className="hero-bg" />

          <HimalayanExpeditionMap treks={treks} />

          <div className="hero-grain" />
          <div className="hero-line" />

          <div className={`hero-content ${heroVisible ? 'visible' : ''}`}>
            <div className={`hero-eyebrow ${heroVisible ? 'visible' : ''}`}>
              <div className="eyebrow-line" />
              <span className="eyebrow-text">Nepal · Himalayan Expeditions</span>
            </div>
            <h1 className="hero-title">
              Where Earth<br />
              Meets <em>Sky</em>
            </h1>
            <p className="hero-subtitle">
              Handcrafted journeys through the world's highest kingdom
            </p>
          </div>
        </div>

        {/* ── STATS BAR ── */}
        <div className="stats-bar">
          {STATS.map(s => (
            <div className="stat-item" key={s.label}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── LISTING (filters + grid + load more) ── */}
        <div className="listing-surface">
        <div className="listing-inner">

        {/* ── FILTERS ── */}
        <div className="filters-section">
          <div className="filters-header">
            <span className="filters-title">Explore routes</span>
            {!loading && !error && (
              <span className="trek-count">{totalTreks} treks available</span>
            )}
          </div>

          <div className="filters-row">
            <div className="search-wrap">
              <svg className="search-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search treks by name or destination…"
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              />
            </div>

            <div className="filter-pill-group">
              {REGIONS.map(r => (
                <button
                  key={r.value}
                  className={`filter-pill ${filters.region === r.value ? 'active' : ''}`}
                  onClick={() => setFilters(f => ({ ...f, region: f.region === r.value ? '' : r.value }))}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <div className="filter-pill-group">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  className={`filter-pill ${filters.difficulty === d ? 'active' : ''}`}
                  onClick={() => setFilters(f => ({ ...f, difficulty: f.difficulty === d ? '' : d }))}
                >
                  {DIFFICULTY_LABELS[d]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active filter tags */}
        {(filters.region || filters.difficulty || filters.search) && (
          <div className="active-filters">
            {filters.region && (
              <div className="active-tag">
                {regionLabel}
                <button onClick={() => setFilters(f => ({ ...f, region: '' }))} aria-label="Remove region filter">×</button>
              </div>
            )}
            {filters.difficulty && (
              <div className="active-tag">
                {DIFFICULTY_LABELS[filters.difficulty]}
                <button onClick={() => setFilters(f => ({ ...f, difficulty: '' }))} aria-label="Remove difficulty filter">×</button>
              </div>
            )}
            {filters.search && (
              <div className="active-tag">
                "{filters.search}"
                <button onClick={() => setFilters(f => ({ ...f, search: '' }))} aria-label="Remove search filter">×</button>
              </div>
            )}
            <button className="clear-all" onClick={() => setFilters({ region: '', difficulty: '', search: '' })}>
              Clear all
            </button>
          </div>
        )}

        <div className="section-divider" />

        {/* ── GRID ── */}
        <div className="grid-section">
          {loading ? (
            <>
              <div className="grid-label">Loading expeditions…</div>
              <div className="treks-grid">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-img" />
                    <div className="skeleton-body">
                      <div className="skeleton-line" style={{ width: '65%' }} />
                      <div className="skeleton-line" style={{ width: '45%', opacity: 0.6 }} />
                      <div className="skeleton-line" style={{ width: '80%', marginTop: 16 }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : error ? (
            <div className="error-state">
              <div className="error-title">Something went wrong</div>
              <p className="empty-sub" style={{ marginBottom: 24 }}>{error}</p>
              <button className="retry-btn" onClick={() => fetchTreks(1, { replace: true })}>
                Try Again
              </button>
            </div>
          ) : treks.length > 0 ? (
            <>
              <div className="grid-label">Showing {treks.length} of {totalTreks} expeditions</div>
              <div className="treks-grid">
                {treks.map(trek => (
                  <TrekCard key={trek.id} trek={trek} />
                ))}
              </div>

              <div className="load-more-section">
                <div className="load-more-count">
                  {!hasMore
                    ? `Showing all ${totalTreks} treks`
                    : `Showing ${treks.length} of ${totalTreks} treks`}
                </div>

                {loadMoreError && (
                  <div className="load-more-error">
                    {loadMoreError}
                    <button
                      className="load-more-retry"
                      onClick={() => fetchTreks(pagination.page + 1, { replace: false })}
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {hasMore ? (
                  <button
                    className="load-more-btn"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore && <span className="load-more-spinner" />}
                    {loadingMore ? 'Loading more treks…' : 'Load More Treks'}
                  </button>
                ) : (
                  !loadMoreError && (
                    <div className="end-message">You've explored all available treks.</div>
                  )
                )}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">◈</span>
              <div className="empty-title">No routes found</div>
              <p className="empty-sub">Adjust your filters to discover more expeditions</p>
            </div>
          )}
        </div>

        </div>
        </div>

      </div>
    </>
  );
}