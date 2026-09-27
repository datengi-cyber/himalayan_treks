
import Link from 'next/link';
import TrekCard from '@/components/TrekCard';
import './home.css';

export const metadata = {
  title: 'Himalaya Treks | Nepal Trekking Packages & Tours',
  description:
    'Book iconic Nepal treks — Everest Base Camp, Annapurna Circuit, Langtang Valley. Expert guides, small groups, unbeatable prices.',
};
export const dynamic = 'force-dynamic';
// ─── Data helpers ───
async function api(path, revalidate, fallback) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, { next: { revalidate } });
    return (await res.json()).data || fallback;
  } catch {
    return fallback;
  }
}

// Cuts on a word boundary instead of mid-word.
const truncate = (text = '', max) =>
  text.length <= max ? text : text.slice(0, max).replace(/\s+\S*$/, '') + '…';

// ─── Static content ───

// Palettes for the little SVG mountain thumbnails (cycled by index).
const MOUNTAIN_PALETTES = [
  { colors: ['#E9C9A3', '#A6794F', '#3a2a08'], sky: '#0A2A20' },
  { colors: ['#dce9dc', '#6f9c80', '#1c3a2a'], sky: '#5c3a1e' },
  { colors: ['#a8d8a8', '#5a8a5a', '#1a3a1a'], sky: '#081408' },
  { colors: ['#f0ddc0', '#b88a52', '#3a2410'], sky: '#0e0f18' },
  { colors: ['#f0a060', '#c05820', '#4a2010'], sky: '#100808' },
];

// Flatten the expedition promos into a de-duplicated quick-link list.
// subtitle looks like "5,364m · 14 Days" → elevation is the part before "·".
function buildPopularTreks(categories = []) {
  const seen = new Set();
  const treks = [];
  categories.forEach((cat) => {
    (cat.promos || []).forEach((p) => {
      if (!p?.href || seen.has(p.href)) return;
      seen.add(p.href);
      const i = treks.length;
      treks.push({
        name: (p.name || '').trim(),
        href: p.href,
        elev: (p.subtitle || '').split('·')[0].trim(),
        ...MOUNTAIN_PALETTES[i % MOUNTAIN_PALETTES.length],
      });
    });
  });
  return treks;
}

const HERO_STATS = [
  { num: '500+', label: 'Treks Completed' },
  { num: '4.9★', label: 'Avg. Rating' },
  { num: '15yr', label: 'Experience' },
];

const NUMBERS = [
  { num: '20+', label: 'Years of Combined Guiding Experience' },
  { num: '560+', label: 'Clients Guided' },
  { num: '97%', label: 'Overall Success Rate' },
  { num: '560+', label: 'Successful Summits' },
  { num: '7', label: 'Continents Operated' },
];

const LEVEL_FALLBACKS = ['Adventure', 'Explorer', 'Expedition', 'Challenge'];

// Decorative floating-particle background for the featured section.
const GLOW_SCRIPT = `
(function () {
  var c = document.getElementById('glow-canvas'); if (!c) return;
  var ctx = c.getContext('2d'), W, H, ps = [];
  function init() {
    W = c.width = c.parentElement.offsetWidth; H = c.height = c.parentElement.offsetHeight;
    ps = Array.from({ length: 70 }, function () {
      return { x: Math.random() * W, y: Math.random() * H, r: .6 + Math.random() * 1.8,
               v: .08 + Math.random() * .18, a: .1 + Math.random() * .25 };
    });
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ps.forEach(function (p) {
      p.y -= p.v; if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = 'rgba(212,163,115,' + p.a + ')'; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  init(); draw(); addEventListener('resize', init);
})();`;

// ─── Small components ───
const Arrow = ({ size = 16, d = 'M2 8h12M9 4l4 4-4 4' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d={d} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Mountain({ id, colors: [top, mid, base], sky }) {
  return (
    <svg viewBox="0 0 63 44" aria-hidden="true">
      <defs>
        <linearGradient id={`m-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} /><stop offset="55%" stopColor={mid} /><stop offset="100%" stopColor={base} />
        </linearGradient>
      </defs>
      <rect width="63" height="44" fill={sky} />
      <path d="M0 44 L14 28 L22 36 L31.5 10 L41 36 L50 27 L63 44Z" fill={`url(#m-${id})`} />
      <path d="M31.5 10 L28 22 L31.5 20 L35 22Z" fill="rgba(248,250,252,.92)" />
      <path d="M0 44 L0 38 L18 34 L31.5 38 L45 33 L63 37 L63 44Z" fill="#0d1a14" opacity=".9" />
    </svg>
  );
}

// ─── Page ───
export default async function HomePage() {
  const [featuredTreks, homepageTrek, expeditions] = await Promise.all([
    api('/treks?featured=true&limit=8', 3600, []),
    api('/treks/homepage', 0, null),
    api('/nav/expeditions', 3600, []),
  ]);

  const popularTreks = buildPopularTreks(expeditions);

  // No repeats: first 4 → level grid, next 4 → "More Featured Treks".
  const levelTreks = featuredTreks.slice(0, 4);
  const moreTreks = featuredTreks.slice(4, 8);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <video
          className="hero-video" autoPlay muted loop playsInline preload="auto" poster="/hero-poster.jpg"
          src="https://res.cloudinary.com/dpziskudt/video/upload/v1778763341/mixkit-fog-on-the-heights-of-the-snowy-mountains-4396-full-hd_slhawq.mp4"
        />
        <div className="hero-overlay" />
        <div className="hero-scroll fade" style={{ '--d': '1.3s' }}><span>Scroll</span><i /></div>

        <div className="hero-content fade">
          <div className="hero-eyebrow fade" style={{ '--d': '.3s' }}>
            <span>Nepal&apos;s Premier Trekking Experience</span>
          </div>
          <h1 className="hero-title fade" style={{ '--d': '.5s' }}>
            <em>Above the</em>
            <strong>Clouds.</strong>
          </h1>
          <p className="hero-desc fade" style={{ '--d': '.7s' }}>
            Where ancient trails meet the roof of the world. We craft intimate, expert-guided
            expeditions through the greatest mountain landscape on earth — Everest, Annapurna, Langtang.
          </p>
          <div className="hero-ctas fade" style={{ '--d': '.9s' }}>
            <Link href="/treks" className="btn-gold">Explore Treks <Arrow size={18} d="M3 9h12M10 4l5 5-5 5" /></Link>
            <Link href="/about" className="hero-link">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" />
                <polygon points="6,5 12,8 6,11" fill="currentColor" />
              </svg>
              Watch Our Story
            </Link>
          </div>
        </div>

        <div className="hero-stats fade" style={{ '--d': '1.1s' }}>
          {HERO_STATS.map((s) => (
            <div key={s.label} className="hero-stat"><b>{s.num}</b><span>{s.label}</span></div>
          ))}
        </div>
      </section>

      {/* QUICK LINKS — desktop chips */}
      {popularTreks.length > 0 && (
        <div className="trek-strip">
          <div className="trek-chips">
            {popularTreks.slice(0, 4).map((t) => (
              <Link key={t.href} href={t.href} className="trek-chip">
                <i>▲</i><b>{t.name}</b><span>{t.elev}</span>
              </Link>
            ))}
          </div>
          <Link href="/treks" className="strip-link">All Treks →</Link>
        </div>
      )}

      {/* QUICK LINKS — mobile stories */}
      {popularTreks.length > 0 && (
        <div className="stories-strip" aria-label="Popular treks">
          <div className="stories-label">Quick Explore</div>
          <div className="stories-row">
            {popularTreks.map((t, i) => (
              <Link key={t.href} href={t.href} className="story-card" aria-label={`${t.name} trek`}>
                <div className="story-ring">
                  <div className="story-inner">
                    <Mountain id={i} colors={t.colors} sky={t.sky} />
                    <span className="story-badge">{t.elev}</span>
                  </div>
                </div>
                <span className="story-name">{t.name}</span>
              </Link>
            ))}
            <Link href="/treks" className="story-card story-all" aria-label="Browse all treks">
              <div className="story-ring">
                <div className="story-inner"><Arrow size={28} d="M4 8h8M9 4l4 4-4 4" /></div>
              </div>
              <span className="story-name">All Treks</span>
            </Link>
          </div>
        </div>
      )}

      {/* FEATURED TREKS */}
      <section className="featured-section">
        <canvas id="glow-canvas" aria-hidden="true" />
        <script dangerouslySetInnerHTML={{ __html: GLOW_SCRIPT }} />

        <div className="section-header">
          <h2 className="section-title">CHOOSE YOUR NEXT <em>ADVENTURE</em></h2>
          <p className="section-subtitle">
            Himalaya Treks takes our trekkers on a journey of growth and discovery, focused on
            safety, a love of the mountains, and unforgettable adventure.
          </p>
        </div>

        {homepageTrek && (
          <div className="featured-banner">
            <img src={homepageTrek.cover_image} alt={homepageTrek.title} />
            <div className="banner-content">
              <span className="banner-eyebrow">Top Trip</span>
              <h3 className="banner-title">{homepageTrek.title}</h3>
              <p className="banner-desc">{truncate(homepageTrek.description, 150)}</p>
              <Link href={`/treks/${homepageTrek.slug}`} className="btn-gold">
                View Trip <Arrow size={14} d="M2 7h10M8 3l4 4-4 4" />
              </Link>
            </div>
          </div>
        )}

        <div className="level-grid">
          {levelTreks.map((trek, i) => {
            const days = trek.duration ? `${trek.duration} Days` : '';
            return (
              <div key={trek.id}>
                <div className="level-marker">
                  <svg width="34" height="24" viewBox="0 0 34 24" fill="none">
                    <path d="M1 22 L9 6 L14 14 L17 8 L20 14 L25 4 L33 22Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                  <b>{trek.difficulty || trek.level || LEVEL_FALLBACKS[i]}</b>
                  <span>{days || trek.grade || ''}</span>
                </div>
                <Link href={`/treks/${trek.slug}`} className="level-card">
                  <img src={trek.cover_image} alt={trek.title} loading="lazy" />
                  <div className="level-body">
                    <h4>{trek.title}</h4>
                    <small>{days || 'View Trip'}</small>
                    <span>View Trip</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* MORE FEATURED */}
      {moreTreks.length > 0 && (
        <section className="featured-section featured-dark">
          <div className="section-header">
            <div className="section-eyebrow">Hand-Picked Adventures</div>
            <h2 className="section-title">More <em>Featured</em> Treks</h2>
          </div>
          <div className="treks-grid">
            {moreTreks.map((trek) => <TrekCard key={trek.id} trek={trek} />)}
          </div>
          <div className="section-footer">
            <Link href="/treks" className="btn-outline">View All Treks <Arrow /></Link>
          </div>
        </section>
      )}

      {/* BY THE NUMBERS */}
      <section className="numbers-section">
        <div className="numbers-inner">
          <p className="numbers-label">Himalaya Treks<br />By The Numbers</p>
          <div className="numbers-grid">
            {NUMBERS.map((s, i) => (
              <div key={i} className="numbers-stat"><b>{s.num}</b><span>{s.label}</span></div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
