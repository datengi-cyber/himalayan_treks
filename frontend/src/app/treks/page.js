'use client';
import { useState, useEffect, useRef } from 'react';
import TrekCard from '@/components/TrekCard';
import api from '@/lib/api';

const REGIONS = ['Everest', 'Annapurna', 'Langtang'];
const DIFFICULTIES = ['easy', 'moderate', 'challenging', 'extreme'];
const DIFFICULTY_LABELS = { easy: 'Easy', moderate: 'Moderate', challenging: 'Challenging', extreme: 'Extreme' };

const STATS = [
  { value: '180+', label: 'Curated Routes' },
  { value: '6100m', label: 'Avg Peak Altitude' },
  { value: '4.9★', label: 'Guide Rating' },
  { value: '12K+', label: 'Adventurers Served' },
];

export default function TreksPage() {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ region: '', difficulty: '', search: '' });
  const [heroVisible, setHeroVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fetchTreks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.region) params.append('region', filters.region);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.search) params.append('search', filters.search);
      const url = `/treks?${params.toString()}`;
      let res;
      if (typeof api?.get === 'function') res = await api.get(url);
      else if (typeof api?.default?.get === 'function') res = await api.default.get(url);
      else throw new Error('api.get is not a function');
      setTreks(res.data.data);
    } catch (err) {
      console.error('FETCH ERROR:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchTreks(); }, [filters]);
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

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

        /* ── FILTERS ─────────────────────────── */
        .filters-section {
          padding: 52px 6vw 0;
          position: relative;
        }

        .filters-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .filters-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          letter-spacing: 0.2em;
          font-weight: 1200;
          text-transform: uppercase;
          color: rgb(0, 0, 0);
      
        }

        .trek-count {
          font-size: 14px;
          color: rgb(0, 0, 0);
          letter-spacing: 0.05em;
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
          color: rgb(0, 0, 0);
          font-size: 15px;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          background: rgba(200, 193, 178, 0.69);
          border: 1px solid rgb(0, 0, 0);
          color: #000000;
          font-family: 'Outfit', sans-serif;
          font-size: 14px;
          padding: 13px 16px 13px 44px;
          border-radius: 10px;
          outline: none;
          transition: border-color 0.25s, background 0.25s;
          box-sizing: border-box;
        }
        .search-input::placeholder { color: rgba(200,190,175,0.3); }
        .search-input:focus {
          border-color: rgba(0, 0, 0, 0.35);
          background: rgba(198,155,80,0.04);
        }

        .filter-pill-group {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .filter-pill {
          padding: 10px 16px;
          border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: rgba(0, 0, 0, 0.55);
          font-family: 'Outfit', sans-serif;
          font-size: 12.5px;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .filter-pill:hover {
          border-color: rgba(198,155,80,0.3);
          color: rgb(255, 166, 11);
          background: rgba(198,155,80,0.05);
        }
        .filter-pill.active {
          border-color: rgba(198,155,80,0.6);
          background: rgba(217, 217, 217, 0.12);
          color: rgb(252, 160, 0);
        }

        /* ── ACTIVE FILTERS STRIP ────────────── */
        .active-filters {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 18px 6vw 0;
          flex-wrap: wrap;
          min-height: 0;
        }

        .active-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px 5px 14px;
          background: rgba(0, 0, 0, 0.1);
          border: 1px solid rgb(0, 0, 0);
          border-radius: 50px;
          font-size: 12px;
          color: rgba(248, 157, 0, 0.9);
          font-family: 'Outfit', sans-serif;
        }

        .active-tag button {
          background: none;
          border: none;
          color: rgba(198,155,80,0.6);
          cursor: pointer;
          font-size: 14px;
          line-height: 1;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .active-tag button:hover { color: rgba(198,155,80,1); }

        .clear-all {
          background: none;
          border: none;
          color: rgb(0, 0, 0);
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          padding: 5px 10px;
          transition: color 0.2s;
          letter-spacing: 0.03em;
        }
        .clear-all:hover { color: rgba(200,190,175,0.6); }

        /* ── DIVIDER ─────────────────────────── */
        .section-divider {
          margin: 40px 6vw 0;
          height: 1px;
          background: linear-gradient(90deg, rgba(198,155,80,0.2), rgba(255,255,255,0.04) 70%, transparent);
        }

        /* ── GRID ────────────────────────────── */
        .grid-section {
          padding: 44px 6vw 100px;
        }

        .grid-label {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgb(0, 0, 0);
          margin-bottom: 28px;
          font-weight: 400;
        }

        .treks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          align-items: stretch;
        }

        /* ── SKELETON ────────────────────────── */
        .skeleton-card {
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
        }

        .skeleton-img {
          height: 220px;
          background: linear-gradient(100deg, rgba(255,255,255,0.03) 30%, rgba(255,255,255,0.065) 50%, rgba(255,255,255,0.03) 70%);
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite;
        }

        .skeleton-body { padding: 20px; }

        .skeleton-line {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(100deg, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 70%);
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite;
          margin-bottom: 10px;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* ── EMPTY STATE ─────────────────────── */
        .empty-state {
          text-align: center;
          padding: 100px 20px;
        }

        .empty-icon {
          font-family: 'Cormorant Garamond', serif;
          font-size: 64px;
          color: rgba(198,155,80,0.15);
          margin-bottom: 24px;
          display: block;
          font-weight: 300;
          font-style: italic;
        }

        .empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 300;
          color: rgba(224,212,192,0.5);
          margin-bottom: 10px;
        }

        .empty-sub {
          font-size: 13px;
          color: rgba(200,190,175,0.3);
          letter-spacing: 0.04em;
        }

        /* ── TREK CARD OVERRIDES ─────────────── */
        /* These let TrekCard inherit the dark theme */
        .treks-grid > * {
          --card-bg: rgba(12,17,24,0.8);
          --card-border: rgba(255,255,255,0.06);
        }
      `}</style>

      <div className="treks-root">

        {/* ── HERO ── */}
        <div className="hero" ref={heroRef}>
          <div className="hero-bg" />

          {/* Minimal SVG mountains */}
          <div className="hero-mountains">
            <svg viewBox="0 0 1440 420" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
              {/* far range */}
              <polygon points="0,420 0,280 180,140 320,240 500,90 640,200 780,60 920,180 1080,100 1220,210 1440,120 1440,420" fill="rgba(20,35,55,0.45)" />
              {/* mid range */}
              <polygon points="0,420 0,340 120,260 260,310 400,200 560,280 700,160 860,250 1000,180 1160,270 1300,200 1440,260 1440,420" fill="rgba(14,25,40,0.6)" />
              {/* near ridge */}
              <polygon points="0,420 0,380 200,340 380,360 540,300 700,350 860,310 1020,360 1200,320 1440,360 1440,420" fill="rgba(10,16,24,0.85)" />
              {/* golden peak accent */}
              <polygon points="780,60 820,130 740,130" fill="rgba(198,155,80,0.12)" />
              <line x1="780" y1="60" x2="780" y2="0" stroke="rgba(198,155,80,0.06)" strokeWidth="1" />
            </svg>
          </div>

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

        {/* ── FILTERS ── */}
        <div className="filters-section">
          <div className="filters-header">
            <span className="filters-title">Explore Routes</span>
            {!loading && (
              <span className="trek-count">{treks.length} expeditions found</span>
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
                placeholder="Search by name, region, altitude…"
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              />
            </div>

            <div className="filter-pill-group">
              {REGIONS.map(r => (
                <button
                  key={r}
                  className={`filter-pill ${filters.region === r ? 'active' : ''}`}
                  onClick={() => setFilters(f => ({ ...f, region: f.region === r ? '' : r }))}
                >
                  {r}
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
                {filters.region}
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
          ) : treks.length > 0 ? (
            <>
              <div className="grid-label">{treks.length} Expeditions Available</div>
              <div className="treks-grid">
                {treks.map(trek => (
                  <TrekCard key={trek.id} trek={trek} />
                ))}
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
    </>
  );
}