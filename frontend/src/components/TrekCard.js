

// import Link from 'next/link';
// import Image from 'next/image';


// const DIFF_STYLES = {
//   easy: {
//     color: 'rgba(0, 0, 0, 0.9)',
//     border: 'rgba(100,210,145,0.25)',
//     bg: 'rgba(12, 148, 19, 0.99)',
//   },
//   moderate: {
//     color: 'hsla(0, 0%, 0%, 0.92)',
//     border: 'rgba(201,169,110,0.25)',
//     bg: 'rgb(255, 255, 255)',
//   },
//   challenging: {
//     color: 'rgba(255, 255, 255, 0.92)',
//     border: 'rgba(225,135,80,0.25)',
//     bg: 'rgba(140, 26, 24, 0.67)',
//   },
//   extreme: {
//     color: 'rgba(220,80,80,0.92)',
//     border: 'rgba(220,80,80,0.25)',
//     bg: 'rgba(0, 0, 0, 0.08)',
//   },
// };

// export default function TrekCard({ trek, index }) {
//   const displayPrice = trek.discount_price || trek.price;
//   const hasDiscount =
//     trek.discount_price && trek.discount_price < trek.price;

//   const diff =
//     DIFF_STYLES[trek.difficulty] || DIFF_STYLES.moderate;

//   const cardNum =
//     index != null
//       ? String(index + 1).padStart(2, '0')
//       : null;

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

//         * {
//           box-sizing: border-box;
//         }

//         .tc-card {
//           position: relative;
//           overflow: hidden;

//           display: flex;
//           flex-direction: column;

//           text-decoration: none;
//           cursor: pointer;

//           border-radius: 24px;

//           background:
//             linear-gradient(
//               180deg,
//               #111a29 0%,
//               #0b1320 100%
//             );

//           border: 1px solid rgba(201,169,110,0.08);

//           transition:
//             transform 0.45s cubic-bezier(0.16,1,0.3,1),
//             box-shadow 0.45s ease,
//             border-color 0.35s ease;

//           box-shadow:
//             0 10px 30px rgba(0,0,0,0.28),
//             0 1px 0 rgba(255,255,255,0.03) inset;

//           -webkit-font-smoothing: antialiased;
//         }

//         .tc-card:hover {
//           transform: translateY(-10px);

//           border-color: rgba(201,169,110,0.18);

//           box-shadow:
//             0 30px 60px rgba(0,0,0,0.45),
//             0 0 0 1px rgba(201,169,110,0.08);
//         }

//         .tc-card::before {
//           content: '';

//           position: absolute;
//           inset: 0;

//           background:
//             linear-gradient(
//               135deg,
//               rgba(255,255,255,0.06),
//               transparent 30%
//             );

//           opacity: 0;

//           transition: opacity 0.4s ease;

//           pointer-events: none;
//           z-index: 20;
//         }

//         .tc-card:hover::before {
//           opacity: 1;
//         }

//         /* IMAGE */
//         .tc-img-wrap {
//           position: relative;
//           height: 260px;
//           overflow: hidden;
//           flex-shrink: 0;
//           background: transparent; /* remove dark bg */
//         }
        
//         .tc-img-inner {
//           position: absolute;
//           inset: 0;
//           transition: transform 0.8s cubic-bezier(0.16,1,0.3,1);
//         }
        
//         .tc-card:hover .tc-img-inner {
//           transform: scale(1.08); /* slightly less zoom for clarity */
//         }
        
//         /* REMOVE dark radial overlay */
//         .tc-img-inner::after {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background: transparent;
//         }
        
//         /* very light overlay only for text readability */
//         .tc-img-overlay {
//           position: absolute;
//           inset: 0;
//           z-index: 1;
//           background: linear-gradient(
//             to top,
//             rgba(0,0,0,0.25) 0%,
//             rgba(0,0,0,0.08) 35%,
//             rgba(0,0,0,0) 100%
//           );
//           pointer-events: none;
//         }
        
//         /* placeholder if image missing */
//         .tc-img-placeholder {
//           width: 100%;
//           height: 100%;
//           background: #321c1cc0;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         /* BADGES */

//         .tc-badges {
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;

//           z-index: 3;

//           padding: 18px;

//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//         }

//         .tc-badge-featured {
//           font-family: 'DM Sans', sans-serif;

//           font-size: 12px;
//           font-weight: 600;

//           letter-spacing: 0.18em;
//           text-transform: uppercase;

//           padding: 6px 11px;

//           border-radius: 999px;

//           border: 2px solid rgb(13, 49, 194);

//           background: rgb(255, 255, 255);

//           color: #000000;

//           backdrop-filter: blur(10px);
//         }

//         .tc-badge-diff {
//           font-family: 'DM Sans', sans-serif;

//           font-size: 12px;
//           font-weight: 600;

//           letter-spacing: 0.12em;
//           text-transform: uppercase;

//           padding: 6px 11px;

//           border-radius: 999px;

//           border: 1px solid currentColor;

//           backdrop-filter: blur(10px);
//         }

//         .tc-num {
//           position: absolute;
//           bottom: 18px;
//           right: 20px;

//           z-index: 3;

//           font-family: 'Cormorant Garamond', serif;

//           font-size: 14px;
//           font-weight: 400;

//           color: rgba(201,169,110,0.42);

//           letter-spacing: 0.18em;
//         }

//         /* BODY */

//         .tc-body {
//           position: relative;
//           z-index: 5;

//           margin-top: -40px;

//           padding: 14px;

//           display: flex;
//           flex-direction: column;
//           flex: 1;

//           background:
//             linear-gradient(
//               180deg,
//               rgba(255, 255, 255, 0.9) 0%,
//               rgba(255, 255, 255, 0.98) 100%
//             );

//           backdrop-filter: blur(20px);
//           -webkit-backdrop-filter: blur(20px);

//           border-top: 1px solid rgba(255,255,255,0.05);

//           box-shadow:
//             0 -10px 30px rgba(0,0,0,0.28),
//             inset 0 1px 0 rgba(255,255,255,0.04);
//         }

//         .tc-region {
//           display: flex;
//           align-items: center;
//           gap: 8px;

//           margin-bottom: 10px;

//           font-family: 'DM Sans', sans-serif;

//           font-size: 10px;
//           font-weight: 500;

//           letter-spacing: 0.22em;
//           text-transform: uppercase;

//           color: rgb(0, 0, 0);
//         }

//         .tc-region::before {
//           content: '';

//           width: 18px;
//           height: 1px;

//           background: rgb(0, 0, 0);
//         }

//         .tc-title {
//           font-family: 'Cormorant Garamond', serif;

//           font-size: 1.85rem;
//           font-weight: 400;

//           line-height: 1.08;

//           color: #000000;

//           margin: 0 0 14px;

//           letter-spacing: 0.015em;

//           text-shadow:
//             0 2px 12px rgba(0,0,0,0.45);

//           transition:
//             color 0.35s ease,
//             transform 0.35s ease;
//         }

//         .tc-card:hover .tc-title {
//           color: #000000;
//           transform: translateY(-1px);
//         }

//         /* RATING */

//         .tc-rating {
//           display: flex;
//           align-items: center;
//           gap: 6px;

//           margin-bottom: 18px;

//           font-size: 12px;
//         }

//         .tc-rating-val {
//           font-family: 'Cormorant Garamond', serif;

//           font-size: 15px;
//           color: #000000;
//         }

//         .tc-rating-stars {
//           color: rgb(0, 0, 0);
//           letter-spacing: -1px;
//         }

//         .tc-rating-count {
//           color: rgb(0, 0, 0);
//         }

//         /* STATS */

//         .tc-stats {
//           display: flex;

//           margin-bottom: 22px;

//           overflow: hidden;

//           border-radius: 16px;

//           background: rgba(255,255,255,0.03);

//           border: 1px solid rgba(255,255,255,0.05);

//           backdrop-filter: blur(10px);
//         }

//         .tc-stat {
//           flex: 1;

//           padding: 14px 8px;

//           text-align: center;

//           border-right: 1px solid rgba(255,255,255,0.05);
//         }

//         .tc-stat:last-child {
//           border-right: none;
//         }

//         .tc-stat-v {
//           font-family: 'Cormorant Garamond', serif;

//           font-size: 18px;
//           font-weight: 400;

//           color: #000000;

//           margin-bottom: 4px;
//         }

//         .tc-stat-k {
//           font-family: 'DM Sans', sans-serif;

//           font-size: 9px;

//           letter-spacing: 0.14em;
//           text-transform: uppercase;

//           color: rgb(0, 0, 0);
//         }

//         .tc-spacer {
//           flex: 1;
//         }

//         /* DIVIDER */

//         .tc-divider {
//           height: 1px;

//           margin-bottom: 18px;

//           background:
//             linear-gradient(
//               90deg,
//               rgba(201,169,110,0.4),
//               transparent
//             );

//           transform: scaleX(0);
//           transform-origin: left;

//           transition:
//             transform 0.45s cubic-bezier(0.16,1,0.3,1);
//         }

//         .tc-card:hover .tc-divider {
//           transform: scaleX(1);
//         }

//         /* FOOTER */

//         .tc-footer {
//           display: flex;
//           align-items: flex-end;
//           justify-content: space-between;

//           gap: 12px;
//         }

//         .tc-price-wrap {
//           display: flex;
//           flex-direction: column;
//           gap: 4px;
//         }

//         .tc-price-orig {
//           font-family: 'DM Sans', sans-serif;

//           font-size: 12px;

//           color: rgb(0, 0, 0);

//           text-decoration: line-through;
//         }

//         .tc-price {
//           font-family: 'Cormorant Garamond', serif;

//           font-size: 2rem;
//           font-weight: 400;

//           color: #000000;

//           line-height: 1;
//         }

//         .tc-price-sub {
//           margin-left: 4px;

//           font-family: 'DM Sans', sans-serif;

//           font-size: 11px;

//           color: rgb(0, 0, 0);
//         }

//         /* CTA */

//         .tc-cta {
//           display: flex;
//           align-items: center;
//           gap: 6px;

//           padding: 11px 15px;

//           border-radius: 999px;

//           background: rgba(201,169,110,0.08);

//           border: 1px solid rgba(201,169,110,0.14);

//           font-family: 'DM Sans', sans-serif;

//           font-size: 10px;
//           font-weight: 500;

//           letter-spacing: 0.16em;
//           text-transform: uppercase;

//           color: rgb(0, 0, 0);

//           transition:
//             background 0.3s ease,
//             border-color 0.3s ease,
//             transform 0.3s ease;
//         }

//         .tc-card:hover .tc-cta {
//           background: rgba(201,169,110,0.16);

//           border-color: rgba(201,169,110,0.3);

//           transform: translateY(-1px);
//         }

//         .tc-cta-arrow {
//           transition: transform 0.3s ease;
//         }

//         .tc-card:hover .tc-cta-arrow {
//           transform: translateX(3px);
//         }

//         /* MOBILE */

//         @media (max-width: 768px) {
//           .tc-img-wrap {
//             height: 230px;
//           }

//           .tc-title {
//             font-size: 1.6rem;
//           }

//           .tc-price {
//             font-size: 1.7rem;
//           }

//           .tc-body {
//             padding: 20px;
//           }
//         }
//       `}</style>

//       <Link
//         href={`/treks/${trek.slug}`}
//         className="tc-card"
//       >
//         {/* IMAGE */}

//         <div className="tc-img-wrap">
//           <div className="tc-img-inner">
//             {trek.cover_image ? (
//               <Image
//                 src={trek.cover_image}
//                 alt={trek.title}
//                 fill
//                 style={{ objectFit: 'cover' }}
//               />
//             ) : (
//               <div className="tc-img-placeholder">
//                 <svg
//                   viewBox="0 0 280 220"
//                   xmlns="http://www.w3.org/2000/svg"
//                   style={{ width: '100%', height: '100%' }}
//                 >
//                   <polygon
//                     points="0,220 0,115 50,60 95,100 140,30 190,85 245,55 280,72 280,220"
//                     fill="rgba(255,255,255,0.05)"
//                   />
//                 </svg>
//               </div>
//             )}
//           </div>

//           <div className="tc-img-overlay" />

//           {/* BADGES */}

//           <div className="tc-badges">
//             {trek.is_featured ? (
//               <span className="tc-badge-featured">
//                 Featured
//               </span>
//             ) : (
//               <span />
//             )}

//             <span
//               className="tc-badge-diff"
//               style={{
//                 color: diff.color,
//                 borderColor: diff.border,
//                 background: diff.bg,
//               }}
//             >
//               {trek.difficulty}
//             </span>
//           </div>

//           {cardNum && (
//             <span className="tc-num">{cardNum}</span>
//           )}
//         </div>

//         {/* BODY */}

//         <div className="tc-body">
//           <div className="tc-region">
//             {trek.region}
//           </div>

//           <h3 className="tc-title">
//             {trek.title}
//           </h3>

//           {trek.avg_rating && (
//             <div className="tc-rating">
//               <span className="tc-rating-val">
//                 {trek.avg_rating}
//               </span>

//               <span className="tc-rating-stars">
//                 ★★★★★
//               </span>

//               {trek.review_count && (
//                 <span className="tc-rating-count">
//                   ({trek.review_count})
//                 </span>
//               )}
//             </div>
//           )}

//           {/* STATS */}

//           <div className="tc-stats">
//             {trek.max_altitude && (
//               <div className="tc-stat">
//                 <div className="tc-stat-v">
//                   {trek.max_altitude}m
//                 </div>

//                 <div className="tc-stat-k">
//                   Altitude
//                 </div>
//               </div>
//             )}

//             <div className="tc-stat">
//               <div className="tc-stat-v">
//                 {trek.duration_days}d
//               </div>

//               <div className="tc-stat-k">
//                 Duration
//               </div>
//             </div>

//             <div className="tc-stat">
//               <div className="tc-stat-v">
//                 Small
//               </div>

//               <div className="tc-stat-k">
//                 Group
//               </div>
//             </div>
//           </div>

//           <div className="tc-spacer" />

//           <div className="tc-divider" />

//           {/* FOOTER */}

//           <div className="tc-footer">
//             <div className="tc-price-wrap">
//               {hasDiscount && (
//                 <span className="tc-price-orig">
//                   ${trek.price}
//                 </span>
//               )}

//               {!hasDiscount && (
//                 <span
//                   style={{
//                     visibility: 'hidden',
//                     fontSize: '12px',
//                   }}
//                 >
//                   —
//                 </span>
//               )}

//               <div>
//                 <span className="tc-price">
//                   ${displayPrice}
//                 </span>

//                 <span className="tc-price-sub">
//                   /person
//                 </span>
//               </div>
//             </div>

//             <span className="tc-cta">
//               View Trek

//               <span className="tc-cta-arrow">
//                 →
//               </span>
//             </span>
//           </div>
//         </div>
//       </Link>
//     </>
//   );
// }



import Link from 'next/link';
import Image from 'next/image';


const DIFF_STYLES = {
  easy: {
    color: 'rgba(0, 0, 0, 0.9)',
    border: 'rgba(100,210,145,0.25)',
    bg: 'rgba(12, 148, 19, 0.99)',
  },
  moderate: {
    color: 'hsla(0, 0%, 0%, 0.92)',
    border: 'rgba(201,169,110,0.25)',
    bg: 'rgb(255, 255, 255)',
  },
  challenging: {
    color: 'rgba(255, 255, 255, 0.92)',
    border: 'rgba(225,135,80,0.25)',
    bg: 'rgba(140, 26, 24, 0.67)',
  },
  extreme: {
    color: 'rgba(220,80,80,0.92)',
    border: 'rgba(220,80,80,0.25)',
    bg: 'rgba(0, 0, 0, 0.08)',
  },
};

export default function TrekCard({ trek, index }) {
  const displayPrice = trek.discount_price || trek.price;
  const hasDiscount =
    trek.discount_price && trek.discount_price < trek.price;

  const diff =
    DIFF_STYLES[trek.difficulty] || DIFF_STYLES.moderate;

  const cardNum =
    index != null
      ? String(index + 1).padStart(2, '0')
      : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

        * {
          box-sizing: border-box;
        }

        .tc-card {
          position: relative;
          overflow: hidden;

          display: flex;
          flex-direction: column;

          text-decoration: none;
          cursor: pointer;

          border-radius: 24px;

          background:
            linear-gradient(
              180deg,
              #111a29 0%,
              #0b1320 100%
            );

          border: 1px solid rgba(201,169,110,0.08);

          transition:
            transform 0.45s cubic-bezier(0.16,1,0.3,1),
            box-shadow 0.45s ease,
            border-color 0.35s ease;

          box-shadow:
            0 10px 30px rgba(0,0,0,0.28),
            0 1px 0 rgba(255,255,255,0.03) inset;

          -webkit-font-smoothing: antialiased;
        }

        .tc-card:hover {
          transform: translateY(-10px);

          border-color: rgba(201,169,110,0.18);

          box-shadow:
            0 30px 60px rgba(0,0,0,0.45),
            0 0 0 1px rgba(201,169,110,0.08);
        }

        .tc-card::before {
          content: '';

          position: absolute;
          inset: 0;

          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,0.06),
              transparent 30%
            );

          opacity: 0;

          transition: opacity 0.4s ease;

          pointer-events: none;
          z-index: 20;
        }

        .tc-card:hover::before {
          opacity: 1;
        }

        /* IMAGE */
        .tc-img-wrap {
          position: relative;
          height: 260px;
          overflow: hidden;
          flex-shrink: 0;
          background: transparent; /* remove dark bg */
        }
        
        .tc-img-inner {
          position: absolute;
          inset: 0;
          transition: transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        
        .tc-card:hover .tc-img-inner {
          transform: scale(1.08); /* slightly less zoom for clarity */
        }
        
        /* REMOVE dark radial overlay */
        .tc-img-inner::after {
          content: '';
          position: absolute;
          inset: 0;
          background: transparent;
        }
        
        /* very light overlay only for text readability */
        .tc-img-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.25) 0%,
            rgba(0,0,0,0.08) 35%,
            rgba(0,0,0,0) 100%
          );
          pointer-events: none;
        }
        
        /* placeholder if image missing */
        .tc-img-placeholder {
          width: 100%;
          height: 100%;
          background: #321c1cc0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* BADGES */

        .tc-badges {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;

          z-index: 3;

          padding: 18px;

          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .tc-badge-featured {
          font-family: 'DM Sans', sans-serif;

          font-size: 12px;
          font-weight: 600;

          letter-spacing: 0.18em;
          text-transform: uppercase;

          padding: 6px 11px;

          border-radius: 999px;

          border: 2px solid rgb(13, 49, 194);

          background: rgb(255, 255, 255);

          color: #000000;

          backdrop-filter: blur(10px);
        }

        .tc-badge-diff {
          font-family: 'DM Sans', sans-serif;

          font-size: 12px;
          font-weight: 600;

          letter-spacing: 0.12em;
          text-transform: uppercase;

          padding: 6px 11px;

          border-radius: 999px;

          border: 1px solid currentColor;

          backdrop-filter: blur(10px);
        }

        .tc-num {
          position: absolute;
          bottom: 18px;
          right: 20px;

          z-index: 3;

          font-family: 'Cormorant Garamond', serif;

          font-size: 14px;
          font-weight: 400;

          color: rgba(201,169,110,0.42);

          letter-spacing: 0.18em;
        }

        /* BODY */

        .tc-body {
          position: relative;
          z-index: 5;

          margin-top: -40px;

          padding: 14px 14px 12px;

          display: flex;
          flex-direction: column;
          flex: 1;

          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(255, 255, 255, 0.98) 100%
            );

          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);

          border-top: 1px solid rgba(255,255,255,0.05);

          box-shadow:
            0 -10px 30px rgba(0,0,0,0.28),
            inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .tc-region {
          display: flex;
          align-items: center;
          gap: 8px;

          margin-bottom: 6px;

          font-family: 'DM Sans', sans-serif;

          font-size: 10px;
          font-weight: 500;

          letter-spacing: 0.22em;
          text-transform: uppercase;

          color: rgb(0, 0, 0);
        }

        .tc-region::before {
          content: '';

          width: 18px;
          height: 1px;

          background: rgb(0, 0, 0);
        }

        .tc-title {
          font-family: 'Cormorant Garamond', serif;

          font-size: 1.7rem;
          font-weight: 400;

          line-height: 1.08;

          color: #000000;

          margin: 0 0 6px;

          letter-spacing: 0.015em;

          text-shadow:
            0 2px 12px rgba(0,0,0,0.45);

          transition:
            color 0.35s ease,
            transform 0.35s ease;
        }

        .tc-card:hover .tc-title {
          color: #000000;
          transform: translateY(-1px);
        }

        /* RATING */

        .tc-rating {
          display: flex;
          align-items: center;
          gap: 6px;

          margin-bottom: 10px;

          font-size: 12px;
        }

        .tc-rating-val {
          font-family: 'Cormorant Garamond', serif;

          font-size: 15px;
          color: #000000;
        }

        .tc-rating-stars {
          color: rgb(0, 0, 0);
          letter-spacing: -1px;
        }

        .tc-rating-count {
          color: rgb(0, 0, 0);
        }

        /* STATS */

        .tc-stats {
          display: flex;

          margin-bottom: 12px;

          overflow: hidden;

          border-radius: 16px;

          background: rgba(255,255,255,0.03);

          border: 1px solid rgba(255,255,255,0.05);

          backdrop-filter: blur(10px);
        }

        .tc-stat {
          flex: 1;

          padding: 10px 8px;

          text-align: center;

          border-right: 1px solid rgba(255,255,255,0.05);
        }

        .tc-stat:last-child {
          border-right: none;
        }

        .tc-stat-v {
          font-family: 'Cormorant Garamond', serif;

          font-size: 18px;
          font-weight: 400;

          color: #000000;

          margin-bottom: 4px;
        }

        .tc-stat-k {
          font-family: 'DM Sans', sans-serif;

          font-size: 9px;

          letter-spacing: 0.14em;
          text-transform: uppercase;

          color: rgb(0, 0, 0);
        }

        .tc-spacer {
          flex: 1;
        }

        /* DIVIDER */

        .tc-divider {
          height: 1px;

          margin-bottom: 10px;

          background:
            linear-gradient(
              90deg,
              rgba(201,169,110,0.4),
              transparent
            );

          transform: scaleX(0);
          transform-origin: left;

          transition:
            transform 0.45s cubic-bezier(0.16,1,0.3,1);
        }

        .tc-card:hover .tc-divider {
          transform: scaleX(1);
        }

        /* FOOTER */

        .tc-footer {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 12px;
        }

        .tc-price-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .tc-price-orig {
          font-family: 'DM Sans', sans-serif;

          font-size: 12px;

          color: rgb(0, 0, 0);

          text-decoration: line-through;
        }

        .tc-price {
          font-family: 'Cormorant Garamond', serif;

          font-size: 2rem;
          font-weight: 400;

          color: #000000;

          line-height: 1;
        }

        .tc-price-sub {
          margin-left: 4px;

          font-family: 'DM Sans', sans-serif;

          font-size: 11px;

          color: rgb(0, 0, 0);
        }

        /* CTA */

        .tc-cta {
          display: flex;
          align-items: center;
          gap: 6px;

          padding: 11px 15px;

          border-radius: 999px;

          background: rgba(201,169,110,0.08);

          border: 1px solid rgba(201,169,110,0.14);

          font-family: 'DM Sans', sans-serif;

          font-size: 10px;
          font-weight: 500;

          letter-spacing: 0.16em;
          text-transform: uppercase;

          color: rgb(0, 0, 0);

          transition:
            background 0.3s ease,
            border-color 0.3s ease,
            transform 0.3s ease;
        }

        .tc-card:hover .tc-cta {
          background: rgba(201,169,110,0.16);

          border-color: rgba(201,169,110,0.3);

          transform: translateY(-1px);
        }

        .tc-cta-arrow {
          transition: transform 0.3s ease;
        }

        .tc-card:hover .tc-cta-arrow {
          transform: translateX(3px);
        }

        /* MOBILE */

        @media (max-width: 768px) {
          .tc-img-wrap {
            height: 230px;
          }

          .tc-title {
            font-size: 1.4rem;
          }

          .tc-price {
            font-size: 1.7rem;
          }

          .tc-body {
            padding: 16px 16px 14px;
          }
        }
      `}</style>

      <Link
        href={`/treks/${trek.slug}`}
        className="tc-card"
      >
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
                    fill="rgba(255,255,255,0.05)"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="tc-img-overlay" />

          {/* BADGES */}

          <div className="tc-badges">
            {trek.is_featured ? (
              <span className="tc-badge-featured">
                Featured
              </span>
            ) : (
              <span />
            )}

            <span
              className="tc-badge-diff"
              style={{
                color: diff.color,
                borderColor: diff.border,
                background: diff.bg,
              }}
            >
              {trek.difficulty}
            </span>
          </div>

          {cardNum && (
            <span className="tc-num">{cardNum}</span>
          )}
        </div>

        {/* BODY */}

        <div className="tc-body">
          <div className="tc-region">
            {trek.region}
          </div>

          <h3 className="tc-title">
            {trek.title}
          </h3>

          {trek.avg_rating && (
            <div className="tc-rating">
              <span className="tc-rating-val">
                {trek.avg_rating}
              </span>

              <span className="tc-rating-stars">
                ★★★★★
              </span>

              {trek.review_count && (
                <span className="tc-rating-count">
                  ({trek.review_count})
                </span>
              )}
            </div>
          )}

          {/* STATS */}

          <div className="tc-stats">
            {trek.max_altitude && (
              <div className="tc-stat">
                <div className="tc-stat-v">
                  {trek.max_altitude}m
                </div>

                <div className="tc-stat-k">
                  Altitude
                </div>
              </div>
            )}

            <div className="tc-stat">
              <div className="tc-stat-v">
                {trek.duration_days}d
              </div>

              <div className="tc-stat-k">
                Duration
              </div>
            </div>

            <div className="tc-stat">
              <div className="tc-stat-v">
                Small
              </div>

              <div className="tc-stat-k">
                Group
              </div>
            </div>
          </div>

          <div className="tc-spacer" />

          <div className="tc-divider" />

          {/* FOOTER */}

          <div className="tc-footer">
            <div className="tc-price-wrap">
              {hasDiscount && (
                <span className="tc-price-orig">
                  ${trek.price}
                </span>
              )}

              {!hasDiscount && (
                <span
                  style={{
                    visibility: 'hidden',
                    fontSize: '12px',
                  }}
                >
                  —
                </span>
              )}

              <div>
                <span className="tc-price">
                  ${displayPrice}
                </span>

                <span className="tc-price-sub">
                  /person
                </span>
              </div>
            </div>

            <span className="tc-cta">
              View Trek

              <span className="tc-cta-arrow">
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </>
  );
}