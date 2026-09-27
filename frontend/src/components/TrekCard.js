

import Link from 'next/link';
import Image from 'next/image';

const DIFF_STYLES = {
  easy: { color: '#0F766E', bg: '#E6F7F3' },
  moderate: { color: '#B45309', bg: '#FFF4E5' },
  challenging: { color: '#C2410C', bg: '#FFEFE8' },
  extreme: { color: '#B91C1C', bg: '#FDECEC' },
};

export default function TrekCard({ trek }) {
  const displayPrice = trek.discount_price || trek.price;
  const hasDiscount =
    trek.discount_price && trek.discount_price < trek.price;

  const diff = DIFF_STYLES[trek.difficulty] || DIFF_STYLES.moderate;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .tc-card {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          text-decoration: none;
          cursor: pointer;
          border-radius: 20px;
          overflow: hidden;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
          transition: transform 200ms ease, box-shadow 200ms ease;
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }

        .tc-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.10);
        }

        .tc-card:focus-visible {
          outline: 2px solid #048BFF;
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .tc-card, .tc-img-inner { transition: none !important; }
          .tc-card:hover { transform: none; }
        }

        /* IMAGE */
        .tc-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          flex-shrink: 0;
          background: #F1F5F9;
        }
        @media (max-width: 640px) {
          .tc-img-wrap { aspect-ratio: 16 / 10; }
        }

        .tc-img-inner {
          position: absolute;
          inset: 0;
          transition: transform 300ms ease;
        }

        .tc-card:hover .tc-img-inner {
          transform: scale(1.02);
        }

        .tc-img-placeholder {
          width: 100%;
          height: 100%;
          background: #EEF2F7;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* BADGES */
        .tc-badges {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          z-index: 3;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
        }

        .tc-badge-featured {
          font-size: 11px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 999px;
          border: 1px solid #048BFF;
          background: rgba(255,255,255,0.94);
          color: #048BFF;
          white-space: nowrap;
        }

        .tc-badge-diff {
          font-size: 11px;
          font-weight: 600;
          text-transform: capitalize;
          padding: 5px 10px;
          border-radius: 999px;
          white-space: nowrap;
        }

        /* BODY */
        .tc-body {
          position: relative;
          z-index: 2;
          padding: 18px 20px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .tc-region {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #048BFF;
          margin-bottom: 4px;
        }

        .tc-title {
          font-size: 22px;
          font-weight: 700;
          line-height: 1.25;
          color: #111827;
          margin: 0 0 8px;
        }

        /* RATING */
        .tc-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 16px;
          font-size: 13.5px;
        }

        .tc-rating-val {
          font-weight: 600;
          color: #111827;
        }

        .tc-rating-stars {
          color: #048BFF;
          font-size: 12px;
        }

        .tc-rating-count {
          color: #94A3B8;
        }

        /* STATS */
        .tc-stats {
          display: flex;
          margin-bottom: 18px;
          overflow: hidden;
          border-radius: 14px;
          background: #F8FAFC;
          border: 1px solid #EEF2F7;
          padding: 10px 4px;
        }

        .tc-stat {
          flex: 1;
          padding: 4px 6px;
          text-align: center;
          border-right: 1px solid #E5E7EB;
        }

        .tc-stat:last-child {
          border-right: none;
        }

        .tc-stat-v {
          font-size: 13.5px;
          font-weight: 600;
          color: #111827;
          line-height: 1.3;
        }

        .tc-stat-k {
          font-size: 10.5px;
          color: #94A3B8;
          margin-top: 2px;
        }

        .tc-spacer {
          flex: 1;
        }

        /* FOOTER */
        .tc-footer {
          margin-top: auto;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
        }

        .tc-price-wrap {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .tc-price-orig {
          font-size: 12.5px;
          color: #94A3B8;
          text-decoration: line-through;
        }

        .tc-price-label {
          font-size: 11.5px;
          color: #64748B;
        }

        .tc-price {
          font-size: 19px;
          font-weight: 700;
          color: #111827;
        }

        .tc-price-sub {
          margin-left: 3px;
          font-size: 12.5px;
          font-weight: 400;
          color: #64748B;
        }

        /* CTA */
        .tc-cta {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 44px;
          padding: 0 18px;
          border-radius: 11px;
          background: #048BFF;
          color: #FFFFFF;
          font-size: 13.5px;
          font-weight: 600;
          white-space: nowrap;
          transition: background 150ms ease, transform 100ms ease;
        }

        .tc-card:hover .tc-cta {
          background: #0078E6;
        }

        .tc-cta-arrow {
          transition: transform 150ms ease;
        }

        .tc-card:hover .tc-cta-arrow {
          transform: translateX(2px);
        }

        /* MOBILE */
        @media (max-width: 420px) {
          .tc-title { font-size: 20px; }
          .tc-cta { height: 42px; padding: 0 14px; font-size: 13px; }
        }
      `}</style>

      <Link href={`/treks/${trek.slug}`} className="tc-card">
        {/* IMAGE */}
        <div className="tc-img-wrap">
          <div className="tc-img-inner">
            {trek.cover_image ? (
              <Image
                src={trek.cover_image}
                alt={trek.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="tc-img-placeholder">
                <svg
                  viewBox="0 0 280 220"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: '100%', height: '100%' }}
                >
                  <polygon
                    points="0,220 0,115 50,60 95,100 140,30 190,85 245,55 280,72 280,220"
                    fill="#E2E8F0"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* BADGES */}
          <div className="tc-badges">
            {trek.is_featured ? (
              <span className="tc-badge-featured">Featured</span>
            ) : (
              <span />
            )}

            <span
              className="tc-badge-diff"
              style={{ color: diff.color, background: diff.bg }}
            >
              {trek.difficulty}
            </span>
          </div>
        </div>

        {/* BODY */}
        <div className="tc-body">
          <div className="tc-region">{trek.region}</div>

          <h3 className="tc-title">{trek.title}</h3>

          {trek.avg_rating && (
            <div className="tc-rating">
              <span className="tc-rating-stars">★</span>
              <span className="tc-rating-val">{trek.avg_rating}</span>
              {trek.review_count && (
                <span className="tc-rating-count">
                  · {trek.review_count} reviews
                </span>
              )}
            </div>
          )}

          {/* STATS */}
          <div className="tc-stats">
            {trek.max_altitude && (
              <div className="tc-stat">
                <div className="tc-stat-v">{trek.max_altitude}m</div>
                <div className="tc-stat-k">Altitude</div>
              </div>
            )}

            <div className="tc-stat">
              <div className="tc-stat-v">{trek.duration_days}d</div>
              <div className="tc-stat-k">Duration</div>
            </div>

            <div className="tc-stat">
              <div className="tc-stat-v">Small</div>
              <div className="tc-stat-k">Group</div>
            </div>
          </div>

          <div className="tc-spacer" />

          {/* FOOTER */}
          <div className="tc-footer">
            <div className="tc-price-wrap">
              {hasDiscount && (
                <span className="tc-price-orig">${trek.price}</span>
              )}
              <span className="tc-price-label">From</span>
              <div>
                <span className="tc-price">${displayPrice}</span>
                <span className="tc-price-sub">/person</span>
              </div>
            </div>

            <span className="tc-cta">
              View Trek
              <span className="tc-cta-arrow">→</span>
            </span>
          </div>
        </div>
      </Link>
    </>
  );
}