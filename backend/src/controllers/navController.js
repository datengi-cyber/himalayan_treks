const pool = require('../config/db');
const { createError } = require('../middleware/errorMiddleware');

// ─── EXPEDITIONS MEGA MENU ─────────────────────────────────
// GET /api/nav/expeditions
const getExpeditionsMenu = async (req, res, next) => {
  try {
    const query = `
      SELECT
        r.id, r.name, r.slug, r.tagline, r.display_order,
        COALESCE(
          json_agg(
            json_build_object('title', t.title, 'slug', t.slug)
            ORDER BY t.menu_order
          ) FILTER (WHERE t.id IS NOT NULL AND t.is_promo = FALSE),
          '[]'
        ) AS subs,
        COALESCE(
          json_agg(
            json_build_object(
              'title', t.title, 'slug', t.slug, 'cover_image', t.cover_image,
              'max_altitude', t.max_altitude, 'duration_days', t.duration_days
            ) ORDER BY t.menu_order
          ) FILTER (WHERE t.id IS NOT NULL AND t.is_promo = TRUE),
          '[]'
        ) AS promos
      FROM regions r
      LEFT JOIN treks t
        ON t.region_id = r.id
        AND t.is_expedition = TRUE
        AND t.show_in_menu  = TRUE
        AND t.is_active     = TRUE
      WHERE r.is_active = TRUE
      GROUP BY r.id
      HAVING COUNT(t.id) > 0
      ORDER BY r.display_order ASC
    `;

    const result = await pool.query(query);

    const data = result.rows.map((region) => ({
      id: region.slug,
      name: region.name,
      tagline: region.tagline,
      subs: region.subs.map((t) => ({
        name: t.title,
        href: `/treks/${t.slug}`,
      })),
      promos: region.promos.slice(0, 2).map((t) => ({
        name: t.title,
        subtitle: [
          t.max_altitude ? `${t.max_altitude.toLocaleString()}m` : null,
          t.duration_days ? `${t.duration_days} Days` : null,
        ].filter(Boolean).join(' · '),
        img: t.cover_image,
        href: `/treks/${t.slug}`,
      })),
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getExpeditionsMenu };