

import JsonLd from '@/components/JsonLd';
import Link from 'next/link';
import BookingWidget from '@/components/BookingWidget';
import TrekGallery from '@/components/TrekGallery';
import TrekReviews from '@/components/TrekReviews';
import { notFound } from 'next/navigation';

async function getTrek(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/treks/${slug}`,
      { next: { revalidate: 600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error('getTrek error:', err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const trek = await getTrek(slug);
  if (!trek) return { title: 'Trek Not Found' };
  return {
    title: trek.meta_title || `${trek.title} | Himalaya Treks`,
    description: trek.meta_description || trek.description?.slice(0, 160),
  };
}

function buildTrekSchema(trek, siteUrl = 'https://www.himalayatreks.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trek.title,
    description: trek.description,
    url: `${siteUrl}/treks/${trek.slug}`,
    image: trek.cover_image || `${siteUrl}/og-image.jpg`,
    touristType: 'Adventure',
    provider: {
      '@type': 'TravelAgency',
      name: 'Himalaya Treks',
      url: siteUrl,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kathmandu',
        addressCountry: 'NP',
      },
    },
    offers: {
      '@type': 'Offer',
      price: trek.discount_price || trek.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/treks/${trek.slug}`,
    },
  };
}

const difficultyStyle = {
  easy: { color: '#2f6b4f', bg: '#e9f3ee' },
  moderate: { color: '#9a5b1f', bg: '#f6ede1' },
  challenging: { color: '#9c3b3b', bg: '#f6e9e9' },
  extreme: { color: '#5a3b8c', bg: '#efe9f6' },
};

export default async function TrekDetailPage({ params }) {
  const { slug } = await params;
  const trek = await getTrek(slug);
  if (!trek) notFound();

  const diff = difficultyStyle[trek.difficulty] || difficultyStyle.moderate;

  return (
    <>
      <JsonLd data={buildTrekSchema(trek)} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        :root {
          --font-display: 'Playfair Display', serif;
          --font-body: 'Inter', system-ui, sans-serif;

          --navy: #192851;
          --navy-deep: #101a38;
          --text-dark: #2b2f36;
          --text-muted: #6b7280;
          --border: #e8e6e0;
          --bg: #ffffff;
          --card: #fbfaf7;
          --accent-blue: #2f5dd0;
          --accent-blue-deep: #244ab0;
          --accent-green: #4f7a5e;
          --accent-green-bg: #eef4ef;
        }

        body {
          background: var(--bg);
          font-family: var(--font-body);
          color: var(--text-dark);
        }

        h1, h2, h3, .td-title, .td-section-title {
          font-family: var(--font-display);
        }

        /* HERO */
        .td-hero {
          position: relative;
          height: 86vh;
          min-height: 520px;
          display: flex;
          align-items: flex-end;
          background: url('${trek.cover_image}') center/cover no-repeat;
        }

        .td-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(16,26,56,0.85) 0%, rgba(16,26,56,0.25) 55%, rgba(16,26,56,0.05) 100%);
        }

        .td-hero-content {
          position: relative;
          padding: 4rem 4rem 3rem;
          color: #fff;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .td-title {
          font-weight: 600;
          font-size: clamp(2.25rem, 4.5vw, 3.75rem);
          line-height: 1.08;
          letter-spacing: -0.01em;
          margin: 0 0 0.75rem;
        }

        .td-subtitle {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.82);
          font-weight: 300;
          max-width: 560px;
        }

        .td-badges {
          display: flex;
          gap: 0.6rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }

        .td-badge {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 0.4rem 0.85rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.25);
          backdrop-filter: blur(8px);
        }

        /* BODY */
        .td-body {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 3.5rem;
          padding: 4rem 3rem 6rem;
          max-width: 1280px;
          margin: auto;
        }

        .td-section {
          margin-bottom: 3rem;
        }

        .td-eyebrow {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--accent-green);
          margin-bottom: 0.5rem;
        }

        .td-section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--navy);
          margin: 0 0 1.25rem;
        }

        .td-overview {
          font-size: 1.02rem;
          line-height: 1.85;
          color: var(--text-dark);
        }

        .td-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .td-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          padding: 1.75rem;
        }

        .td-stat {
          font-size: 0.82rem;
          color: var(--text-muted);
          text-align: left;
        }

        .td-stat strong {
          display: block;
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 0.2rem;
        }

        .td-highlight-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 0.85rem;
        }

        .td-highlight-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          color: var(--text-dark);
          line-height: 1.6;
        }

        .td-highlight-icon {
          flex-shrink: 0;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--accent-green-bg);
          color: var(--accent-green);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          margin-top: 2px;
        }

        .td-day-card {
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1.5rem 1.75rem;
          margin-bottom: 0.85rem;
          background: #fff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .td-day-card:hover {
          border-color: #d8d4ca;
          box-shadow: 0 4px 18px rgba(25,40,81,0.06);
        }

        .td-day-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--accent-blue);
          margin-bottom: 0.35rem;
        }

        .td-day-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 0.5rem;
        }

        .td-day-desc {
          color: var(--text-muted);
          line-height: 1.7;
          font-size: 0.95rem;
        }

        .td-day-meta {
          margin-top: 0.85rem;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          font-size: 0.78rem;
          color: var(--text-muted);
          border-top: 1px solid var(--border);
          padding-top: 0.75rem;
        }

        .td-day-meta span {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        /* Gallery */
        .td-gallery {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .td-gallery-item {
          border: none;
          padding: 0;
          background: none;
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
          display: block;
        }

        .td-gallery-item img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          display: block;
          transition: transform 0.35s ease;
        }

        .td-gallery-item:hover img {
          transform: scale(1.05);
        }

        /* Lightbox */
        .td-lightbox {
          position: fixed;
          inset: 0;
          background: rgba(16,26,56,0.92);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .td-lightbox-img {
          max-width: 88vw;
          max-height: 82vh;
          border-radius: 8px;
          object-fit: contain;
        }

        .td-lightbox-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(255,255,255,0.12);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.25);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 1rem;
          cursor: pointer;
        }

        .td-lightbox-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.12);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.25);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .td-lightbox-prev { left: 1.5rem; }
        .td-lightbox-next { right: 1.5rem; }

        .td-lightbox-counter {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.85);
          font-size: 0.85rem;
          background: rgba(255,255,255,0.1);
          padding: 0.3rem 0.9rem;
          border-radius: 999px;
        }

        /* FAQ */
        .td-faq-item {
          border-bottom: 1px solid var(--border);
          padding: 1.1rem 0;
        }

        .td-faq-q {
          font-weight: 600;
          color: var(--navy);
          font-size: 1rem;
          margin-bottom: 0.4rem;
        }

        .td-faq-a {
          color: var(--text-muted);
          line-height: 1.7;
          font-size: 0.92rem;
        }

        /* RESPONSIVE */
        @media (max-width: 980px) {
          .td-body {
            grid-template-columns: 1fr;
            padding: 2rem 1.25rem 3rem;
            gap: 2.5rem;
          }

          .td-hero-content {
            padding: 2rem 1.5rem;
          }

          .td-stat-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .td-gallery {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      {/* HERO */}
      <section className="td-hero">
        <div className="td-overlay" />
        <div className="td-hero-content">
          <div className="td-badges">
            <span
              className="td-badge"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
            >
              {trek.difficulty}
            </span>
            {trek.region && (
              <span className="td-badge">{trek.region}</span>
            )}
            {trek.duration_days && (
              <span className="td-badge">{trek.duration_days} Days</span>
            )}
          </div>

          <h1 className="td-title">{trek.title}</h1>
          {trek.short_description && (
            <p className="td-subtitle">{trek.short_description}</p>
          )}
        </div>
      </section>

      <div className="td-body">
        {/* LEFT CONTENT */}
        <div>
          {/* Overview */}
          <div className="td-section">
            <div className="td-eyebrow">The Journey</div>
            <div className="td-section-title">Overview</div>
            <p className="td-overview">{trek.description}</p>
          </div>

          {/* Trip Details */}
          <div className="td-section">
            <div className="td-section-title">Trip Details</div>
            <div className="td-card td-stat-grid">
              <div className="td-stat">
                <strong>{trek.duration_days}</strong>
                Days
              </div>
              <div className="td-stat">
                <strong>{trek.max_altitude || 'N/A'} m</strong>
                Max Altitude
              </div>
              <div className="td-stat">
                <strong>{trek.max_group_size || 'N/A'}</strong>
                Group Size
              </div>
              <div className="td-stat">
                <strong>{trek.distance_km || 'N/A'} km</strong>
                Distance
              </div>
            </div>
          </div>

          {/* Highlights */}
          {trek.highlights?.length > 0 && (
            <div className="td-section">
              <div className="td-section-title">Highlights</div>
              <div className="td-card">
                <ul className="td-highlight-list">
                  {trek.highlights.map((h, i) => (
                    <li key={i} className="td-highlight-item">
                      <span className="td-highlight-icon">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Itinerary */}
          {trek.itinerary?.length > 0 && (
            <div className="td-section">
              <div className="td-section-title">Itinerary</div>

              {trek.itinerary.map((day, i) => (
                <div key={i} className="td-day-card">
                  <div className="td-day-label">Day {day.day || i + 1}</div>
                  <div className="td-day-title">{day.title}</div>
                  <div className="td-day-desc">{day.description}</div>

                  {(day.altitude || day.distance || day.duration) && (
                    <div className="td-day-meta">
                      {day.altitude && <span>⛰ {day.altitude}</span>}
                      {day.distance && <span>📏 {day.distance}</span>}
                      {day.duration && <span>⏱ {day.duration}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Gallery */}
          {trek.images?.filter(img => !img.is_cover).length > 0 && (
            <div className="td-section">
              <div className="td-section-title">Gallery</div>
              <TrekGallery
                images={trek.images.filter(img => !img.is_cover)}
                trekTitle={trek.title}
              />
            </div>
          )}

          {/* FAQs */}
          {trek.faqs?.length > 0 && (
            <div className="td-section">
              <div className="td-section-title">Frequently Asked Questions</div>
              <div className="td-card" style={{ padding: '0.5rem 1.5rem' }}>
                {trek.faqs.map((faq, i) => (
                  <div key={i} className="td-faq-item">
                    <div className="td-faq-q">{faq.question}</div>
                    <div className="td-faq-a">{faq.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}

          <TrekReviews trekId={trek.id} />
        </div>

        {/* BOOKING */}
        <div>
          <BookingWidget trek={trek} />
        </div>
      </div>
    </>
  );
}