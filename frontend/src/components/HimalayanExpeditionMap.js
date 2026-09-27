'use client';

import { useState, useCallback, useId, useMemo } from 'react';
import Link from 'next/link';
import styles from './HimalayanExpeditionMap.module.css';

// Positions are independent of trek data: trek #1 (first fetched) always
// uses slot 1, trek #2 uses slot 2, etc. Heights follow a hand-placed
// ascending/descending skyline (tallest near slot 6), not a straight row.
const VIEW_W = 1440;
const VIEW_H = 520;
const BASE_Y = 480;

const PEAK_SLOTS = [
  { x: 60, height: 180 },
  { x: 204, height: 230 },
  { x: 349, height: 265 },
  { x: 493, height: 300 },
  { x: 638, height: 340 },
  { x: 782, height: 400 }, // tallest — the "Everest" position
  { x: 927, height: 350 },
  { x: 1071, height: 310 },
  { x: 1216, height: 270 },
  { x: 1360, height: 235 },
].map((slot) => ({ ...slot, apexY: BASE_Y - slot.height }));

// Deterministic pseudo-random offset (no Math.random) so server- and
// client-rendered markup match exactly on hydration.
function jag(i, salt) {
  return Math.abs(Math.sin(i * 12.9898 + salt * 4.14)) * 10 - 5;
}

function valleyBetween(a, b) {
  const height = Math.min(a.height, b.height) * 0.35;
  return { x: (a.x + b.x) / 2, y: BASE_Y - height };
}

// One jagged, hand-drawn-looking outline segment for a single peak, from
// the valley on its left, up to its apex, down to the valley on its right.
function peakOutline(left, apex, right, i) {
  const midLeftX = left.x + (apex.x - left.x) * 0.55;
  const midLeftY = left.y + (apex.apexY - left.y) * 0.55 + jag(i, 1);
  const midRightX = apex.x + (right.x - apex.x) * 0.45;
  const midRightY = apex.apexY + (right.y - apex.apexY) * 0.45 + jag(i, 2);
  return `M ${left.x} ${left.y} L ${midLeftX} ${midLeftY} L ${apex.x} ${apex.apexY} L ${midRightX} ${midRightY} L ${right.x} ${right.y}`;
}

function peakFillPath(left, apex, right, i) {
  return `${peakOutline(left, apex, right, i)} L ${right.x} ${BASE_Y} L ${left.x} ${BASE_Y} Z`;
}

// A few organic "vein" branches fanning down from the highlighted peak's
// apex, evoking the hand-sketched topographic texture in the reference.
function veinPaths(apex, halfWidth) {
  const trunkBottomX = apex.x + halfWidth * 0.05;
  const trunkBottomY = apex.apexY + (BASE_Y - apex.apexY) * 0.62;
  const trunk = `M ${apex.x} ${apex.apexY + 6} C ${apex.x - halfWidth * 0.08} ${apex.apexY + 40}, ${trunkBottomX - halfWidth * 0.1} ${trunkBottomY - 30}, ${trunkBottomX} ${trunkBottomY}`;
  const branchA = `M ${apex.x - halfWidth * 0.06} ${apex.apexY + 55} C ${apex.x - halfWidth * 0.28} ${apex.apexY + 80}, ${apex.x - halfWidth * 0.34} ${apex.apexY + 110}, ${apex.x - halfWidth * 0.42} ${apex.apexY + 145}`;
  const branchB = `M ${trunkBottomX - halfWidth * 0.04} ${trunkBottomY - 20} C ${apex.x + halfWidth * 0.22} ${trunkBottomY + 10}, ${apex.x + halfWidth * 0.3} ${trunkBottomY + 35}, ${apex.x + halfWidth * 0.38} ${trunkBottomY + 65}`;
  const branchC = `M ${apex.x} ${apex.apexY + 90} C ${apex.x - halfWidth * 0.1} ${apex.apexY + 120}, ${apex.x - halfWidth * 0.05} ${apex.apexY + 150}, ${apex.x - halfWidth * 0.14} ${apex.apexY + 182}`;
  return [trunk, branchA, branchB, branchC];
}

function formatAltitude(m) {
  if (m == null) return null;
  return `${Number(m).toLocaleString()}m`;
}

export default function HimalayanExpeditionMap({ treks = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const uid = useId();

  const points = useMemo(
    () =>
      treks
        .slice(0, PEAK_SLOTS.length)
        .map((trek, i) => ({ trek, slot: PEAK_SLOTS[i], index: i })),
    [treks]
  );

  const highlightIndex = useMemo(() => {
    if (points.length === 0) return null;
    const featured = points.find((p) => p.trek.is_featured);
    if (featured) return featured.index;
    let best = points[0];
    for (const p of points) {
      if ((p.trek.max_altitude || 0) > (best.trek.max_altitude || 0)) best = p;
    }
    return best.index;
  }, [points]);

  const handleEnter = useCallback((i) => setActiveIndex(i), []);
  const handleLeave = useCallback(() => setActiveIndex(null), []);

  // Boundaries: baseline at the far edges, valleys between each pair of peaks.
  const boundaries = useMemo(() => {
    const n = PEAK_SLOTS.length;
    const b = [{ x: 0, y: BASE_Y }];
    for (let i = 0; i < n - 1; i++) {
      b.push(valleyBetween(PEAK_SLOTS[i], PEAK_SLOTS[i + 1]));
    }
    b.push({ x: VIEW_W, y: BASE_Y });
    return b;
  }, []);

  return (
    <div className={styles.wrap}>
      {/* "stage" is locked to the exact same aspect ratio as the SVG
          viewBox and anchored to the bottom, so the HTML label layer and
          the SVG mountain art always share one identical coordinate box —
          percentages computed from view-box units line up with the art
          at every screen size, instead of drifting against the taller
          hero container around it. */}
      <div className={styles.stage} style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Illustrated elevation map of featured Himalayan expeditions"
        >
          <defs>
            <linearGradient id={`${uid}-vignette`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill={`url(#${uid}-vignette)`} />

          {/* one continuous skyline, built as per-peak segments so each
              can be styled independently on hover, while still reading
              as a single connected mountain contour */}
          {PEAK_SLOTS.map((slot, i) => {
            const left = boundaries[i];
            const right = boundaries[i + 1];
            const isHighlight = i === highlightIndex;
            const isActive = activeIndex === i;
            const halfWidth = (right.x - left.x) / 2;

            return (
              <g key={i}>
                {isHighlight && (
                  <path d={peakFillPath(left, slot, right, i)} className={styles.highlightFill} />
                )}
                <path
                  d={peakOutline(left, slot, right, i)}
                  className={`${styles.peakLine} ${isActive ? styles.peakLineActive : ''} ${
                    isHighlight ? styles.peakLineHighlight : ''
                  }`}
                />
                {/* subtle static ridge-texture creases */}
                <path
                  d={`M ${slot.x} ${slot.apexY + 8} L ${slot.x - halfWidth * 0.4} ${BASE_Y}`}
                  className={styles.texture}
                />
                <path
                  d={`M ${slot.x} ${slot.apexY + 8} L ${slot.x + halfWidth * 0.45} ${BASE_Y}`}
                  className={styles.texture}
                />
                {isHighlight &&
                  veinPaths(slot, halfWidth).map((d, vi) => (
                    <path key={vi} d={d} className={styles.vein} />
                  ))}
              </g>
            );
          })}
        </svg>

        {/* labels: always visible, bracket-leader style, matching the
            reference infographic — not a hover-only tooltip */}
        <div className={styles.labelLayer}>
          {points.map(({ trek, slot, index }) => {
            const label = trek.title || 'Expedition';
            const altitude = formatAltitude(trek.max_altitude);
            const isActive = activeIndex === index;
            const isHighlight = index === highlightIndex;
            const mirrored = slot.x > VIEW_W * 0.75;
            const tickLen = index % 2 === 0 ? 46 : 74;

            const leftPct = (slot.x / VIEW_W) * 100;
            const topPct = ((slot.apexY - tickLen) / VIEW_H) * 100;
            const heightPct = (tickLen / VIEW_H) * 100;

            const commonProps = {
              className: `${styles.peak} ${mirrored ? styles.peakMirrored : ''} ${
                isActive ? styles.peakHover : ''
              } ${isHighlight ? styles.peakHighlight : ''}`,
              style: { left: `${leftPct}%`, top: `${topPct}%`, height: `${heightPct}%` },
              onMouseEnter: () => handleEnter(index),
              onMouseLeave: handleLeave,
              onFocus: () => handleEnter(index),
              onBlur: handleLeave,
              'aria-label': `View ${label} expedition`,
            };

            const content = (
              <>
                <span className={styles.textBlock}>
                  <span className={styles.peakName}>{label}</span>
                  {altitude && <span className={styles.peakAlt}>{altitude}</span>}
                </span>
                <span className={styles.tick} aria-hidden="true" />
              </>
            );

            return trek.slug ? (
              <Link key={trek.id || trek.slug} href={`/treks/${trek.slug}`} {...commonProps}>
                {content}
              </Link>
            ) : (
              <button key={trek.id || index} type="button" disabled aria-disabled="true" {...commonProps}>
                {content}
              </button>
            );
          })}
        </div>
      </div>

      {/* compass rose — decorative, matches the reference illustration */}
      <svg className={styles.compass} viewBox="0 0 40 40" aria-hidden="true">
        <polygon points="20,4 25,20 20,36 15,20" className={styles.compassArrow} />
        <text x="20" y="2" textAnchor="middle" className={styles.compassLabel}>
          N
        </text>
      </svg>
    </div>
  );
}