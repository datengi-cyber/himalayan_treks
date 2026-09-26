

// const pool = require('../config/db');
// const { createError } = require('../middleware/errorMiddleware');

// // These are managed EXCLUSIVELY through updateTrek — never at creation time.
// // Keeping this list in one place also makes updateTrek's whitelist below easy to audit.
// const MANAGED_VISIBILITY_FIELDS = [
//   'is_homepage',
//   'is_featured',
//   'is_expedition',
//   'is_active',
//   'show_in_menu',
//   'is_promo',
// ];

// // ============================================
// // GET /api/treks  — list + filter + paginate
// // ============================================
// const getAllTreks = async (req, res, next) => {
//   try {
//     const { region, difficulty, featured, search, page = 1, limit = 10 } = req.query;

//     let conditions = ['t.is_active = TRUE'];
//     let params = [];
//     let paramCount = 1;

//     // `region` now refers to regions.slug (e.g. "everest"), not free text.
//     if (region) {
//       conditions.push(`r.slug = $${paramCount}`);
//       params.push(region);
//       paramCount++;
//     }

//     if (difficulty) {
//       conditions.push(`t.difficulty = $${paramCount}`);
//       params.push(difficulty);
//       paramCount++;
//     }

//     if (featured === 'true') {
//       conditions.push(`t.is_featured = TRUE`);
//     }

//     if (search) {
//       conditions.push(`(t.title ILIKE $${paramCount} OR t.description ILIKE $${paramCount})`);
//       params.push(`%${search}%`);
//       paramCount++;
//     }

//     const whereClause = `WHERE ${conditions.join(' AND ')}`;

//     const offset = (page - 1) * limit;
//     params.push(limit, offset);

//     const query = `
//       SELECT
//         t.id, t.title, t.slug, t.difficulty, t.duration_days,
//         t.max_altitude, t.price, t.discount_price,
//         r.id AS region_id, r.name AS region_name, r.slug AS region_slug,
//         t.cover_image, t.is_featured, t.is_homepage, t.is_expedition,
//         ROUND(AVG(rv.rating), 1) AS avg_rating,
//         COUNT(DISTINCT rv.id) AS review_count
//       FROM treks t
//       LEFT JOIN regions r ON r.id = t.region_id
//       LEFT JOIN reviews rv ON rv.trek_id = t.id AND rv.is_approved = TRUE
//       ${whereClause}
//       GROUP BY t.id, r.id, r.name, r.slug
//       ORDER BY t.is_featured DESC, t.created_at DESC
//       LIMIT $${paramCount} OFFSET $${paramCount + 1}
//     `;

//     // NOTE: count query needs the same join as the filter now references r.slug
//     const countQuery = `
//       SELECT COUNT(DISTINCT t.id) FROM treks t
//       LEFT JOIN regions r ON r.id = t.region_id
//       ${whereClause}
//     `;

//     const [treksResult, countResult] = await Promise.all([
//       pool.query(query, params),
//       pool.query(countQuery, params.slice(0, -2)),
//     ]);

//     const total = parseInt(countResult.rows[0].count, 10);

//     res.json({
//       success: true,
//       data: treksResult.rows,
//       pagination: {
//         total,
//         page: parseInt(page, 10),
//         limit: parseInt(limit, 10),
//         totalPages: Math.ceil(total / limit),
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // ============================================
// // GET /api/treks/:slug  — public detail page
// // ============================================
// const getTrekBySlug = async (req, res, next) => {
//   try {
//     const { slug } = req.params;

//     const trekResult = await pool.query(
//       `SELECT
//         t.*,
//         r.name AS region_name, r.slug AS region_slug, r.tagline AS region_tagline,
//         ROUND(AVG(rv.rating), 1) AS avg_rating,
//         COUNT(DISTINCT rv.id) AS review_count
//        FROM treks t
//        LEFT JOIN regions r ON r.id = t.region_id
//        LEFT JOIN reviews rv ON rv.trek_id = t.id AND rv.is_approved = TRUE
//        WHERE t.slug = $1 AND t.is_active = TRUE
//        GROUP BY t.id, r.id`,
//       [slug]
//     );

//     if (trekResult.rows.length === 0) {
//       return next(createError('Trek not found.', 404));
//     }

//     const trek = trekResult.rows[0];

//     const imagesResult = await pool.query(
//       'SELECT * FROM trek_images WHERE trek_id = $1 ORDER BY is_cover DESC, sort_order ASC',
//       [trek.id]
//     );

//     const reviewsResult = await pool.query(
//       `SELECT r.*, u.name AS user_name, u.avatar_url
//        FROM reviews r
//        JOIN users u ON u.id = r.user_id
//        WHERE r.trek_id = $1 AND r.is_approved = TRUE
//        ORDER BY r.created_at DESC
//        LIMIT 10`,
//       [trek.id]
//     );

//     res.json({
//       success: true,
//       data: { ...trek, images: imagesResult.rows, reviews: reviewsResult.rows },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // ============================================
// // POST /api/treks  (Admin)
// // Step 1 of the workflow: core trek info + cover image + gallery,
// // all created together in a single transaction. Visibility/marketing
// // flags are intentionally rejected here — they belong to updateTrek.
// // ============================================
// const createTrek = async (req, res, next) => {
//   const {
//     title, slug, description, highlights, itinerary,
//     difficulty, duration_days, max_altitude, distance_km,
//     price, discount_price, max_group_size, min_group_size,
//     region_id, start_location, end_location,
//     meta_title, meta_description,
//     cover_image,      // string URL, or { image_url, caption }
//     gallery_images,   // [{ image_url, caption?, sort_order? }, ...]
//   } = req.body;

//   if (!title || !slug || !description || !difficulty || !duration_days || !price) {
//     return next(createError(
//       'Title, slug, description, difficulty, duration and price are required.', 400
//     ));
//   }

//   const rejected = MANAGED_VISIBILITY_FIELDS.filter((f) => req.body[f] !== undefined);
//   if (rejected.length > 0) {
//     return next(createError(
//       `These fields are set via Update Trek, not on creation: ${rejected.join(', ')}`, 400
//     ));
//   }

//   const coverUrl = typeof cover_image === 'string' ? cover_image : cover_image?.image_url || null;
//   const coverCaption = typeof cover_image === 'string' ? null : cover_image?.caption || null;

//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');

//     const trekResult = await client.query(
//       `INSERT INTO treks (
//         title, slug, description, highlights, itinerary,
//         difficulty, duration_days, max_altitude, distance_km,
//         price, discount_price, max_group_size, min_group_size,
//         region_id, start_location, end_location, cover_image,
//         meta_title, meta_description
//       ) VALUES (
//         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
//         $11,$12,$13,$14,$15,$16,$17,$18,$19
//       ) RETURNING *`,
//       [
//         title, slug, description,
//         highlights || null,
//         itinerary ? JSON.stringify(itinerary) : null,
//         difficulty, duration_days, max_altitude || null,
//         distance_km || null, price, discount_price || null,
//         max_group_size || 12, min_group_size || 1,
//         region_id || null, start_location || null, end_location || null,
//         coverUrl,
//         meta_title || null, meta_description || null,
//       ]
//     );

//     const trek = trekResult.rows[0];

//     // Build the combined image list: cover (is_cover = TRUE) + gallery.
//     const imageRows = [];
//     if (coverUrl) {
//       imageRows.push({ url: coverUrl, caption: coverCaption, isCover: true, sortOrder: 0 });
//     }
//     if (Array.isArray(gallery_images)) {
//       gallery_images.forEach((img, idx) => {
//         if (img?.image_url) {
//           imageRows.push({
//             url: img.image_url,
//             caption: img.caption || null,
//             isCover: false,
//             sortOrder: img.sort_order ?? idx + 1,
//           });
//         }
//       });
//     }

//     for (const img of imageRows) {
//       await client.query(
//         `INSERT INTO trek_images (trek_id, image_url, caption, is_cover, sort_order)
//          VALUES ($1,$2,$3,$4,$5)`,
//         [trek.id, img.url, img.caption, img.isCover, img.sortOrder]
//       );
//     }

//     await client.query('COMMIT');

//     const imagesResult = await pool.query(
//       'SELECT * FROM trek_images WHERE trek_id = $1 ORDER BY is_cover DESC, sort_order ASC',
//       [trek.id]
//     );

//     res.status(201).json({
//       success: true,
//       message: 'Trek created successfully.',
//       data: { ...trek, images: imagesResult.rows },
//     });
//   } catch (err) {
//     await client.query('ROLLBACK');
//     if (err.code === '23505') {
//       return next(createError('A trek with this slug already exists.', 409));
//     }
//     if (err.code === '23503') {
//       return next(createError('Invalid region_id — that region does not exist.', 400));
//     }
//     next(err);
//   } finally {
//     client.release();
//   }
// };

// // ============================================
// // PUT /api/treks/:id  (Admin)
// // Step 2 of the workflow: edit core fields if needed, and manage all
// // visibility/marketing settings (is_homepage, is_featured, is_expedition,
// // is_active, show_in_menu, menu_order, is_promo) plus region_id.
// // ============================================
// const updateTrek = async (req, res, next) => {
//   const { id } = req.params;

//   const fields = [
//     // core info — editable later for corrections, but not the focus of this step
//     'title', 'slug', 'description', 'highlights', 'itinerary',
//     'difficulty', 'duration_days', 'max_altitude', 'distance_km',
//     'price', 'discount_price', 'max_group_size', 'min_group_size',
//     'region_id', 'start_location', 'end_location', 'cover_image',
//     'meta_title', 'meta_description',
//     // visibility / marketing settings — this is the primary purpose of updateTrek
//     'is_homepage', 'is_featured', 'is_expedition', 'is_active',
//     'show_in_menu', 'menu_order', 'is_promo',
//   ];

//   const updates = [];
//   const values = [];
//   let paramCount = 1;

//   fields.forEach((field) => {
//     if (req.body[field] !== undefined) {
//       let value = req.body[field];
//       if (field === 'itinerary' && value !== null) value = JSON.stringify(value);
//       updates.push(`${field} = $${paramCount}`);
//       values.push(value);
//       paramCount++;
//     }
//   });

//   if (updates.length === 0) {
//     return next(createError('No valid fields to update.', 400));
//   }

//   const client = await pool.connect();
//   try {
//     const existing = await client.query('SELECT id FROM treks WHERE id = $1', [id]);
//     if (existing.rows.length === 0) {
//       return next(createError('Trek not found.', 404));
//     }

//     await client.query('BEGIN');

//     // Only one trek may be the homepage trek at a time — clear the rest first.
//     if (req.body.is_homepage === true) {
//       await client.query('UPDATE treks SET is_homepage = FALSE WHERE id != $1', [id]);
//     }

//     values.push(id);
//     const result = await client.query(
//       `UPDATE treks SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
//       values
//     );

//     await client.query('COMMIT');

//     res.json({
//       success: true,
//       message: 'Trek updated successfully.',
//       data: result.rows[0],
//     });
//   } catch (err) {
//     await client.query('ROLLBACK');
//     if (err.code === '23505') {
//       return next(createError('A trek with this slug already exists.', 409));
//     }
//     if (err.code === '23503') {
//       return next(createError('Invalid region_id — that region does not exist.', 400));
//     }
//     next(err);
//   } finally {
//     client.release();
//   }
// };

// // ============================================
// // DELETE /api/treks/:id  (Admin)
// // trek_images cascade automatically; bookings/reviews RESTRICT the delete.
// // ============================================
// const deleteTrek = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const result = await pool.query(
//       'DELETE FROM treks WHERE id = $1 RETURNING id, title',
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return next(createError('Trek not found.', 404));
//     }

//     res.json({
//       success: true,
//       message: `Trek "${result.rows[0].title}" deleted successfully.`,
//     });
//   } catch (err) {
//     if (err.code === '23503') {
//       return next(createError(
//         'Cannot delete this trek — it has existing bookings or reviews.', 409
//       ));
//     }
//     next(err);
//   }
// };

// // ============================================
// // GET /api/treks/id/:id  (Admin — raw record for edit forms)
// // ============================================
// const getTrekById = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const trekResult = await pool.query(
//       `SELECT t.*, r.name AS region_name, r.slug AS region_slug
//        FROM treks t
//        LEFT JOIN regions r ON r.id = t.region_id
//        WHERE t.id = $1`,
//       [id]
//     );

//     if (trekResult.rows.length === 0) {
//       return next(createError('Trek not found.', 404));
//     }

//     const imagesResult = await pool.query(
//       'SELECT * FROM trek_images WHERE trek_id = $1 ORDER BY is_cover DESC, sort_order ASC',
//       [id]
//     );

//     res.json({ success: true, data: { ...trekResult.rows[0], images: imagesResult.rows } });
//   } catch (err) {
//     next(err);
//   }
// };

// // ============================================
// // GET /api/treks/homepage  — public
// // ============================================
// const getHomepageTrek = async (req, res, next) => {
//   try {
//     // ORDER/LIMIT is a defensive fallback; updateTrek guarantees at most one
//     // row has is_homepage = TRUE, but this keeps the endpoint safe regardless.
//     const result = await pool.query(
//       `SELECT t.*, r.name AS region_name, r.slug AS region_slug
//        FROM treks t
//        LEFT JOIN regions r ON r.id = t.region_id
//        WHERE t.is_homepage = TRUE
//        ORDER BY t.updated_at DESC
//        LIMIT 1`
//     );

//     res.status(200).json({
//       success: true,
//       data: result.rows[0] || null,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// // ============================================
// // POST /api/treks/:id/images  (Admin — add a gallery image after creation)
// // ============================================
// const addTrekImage = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { image_url, caption, is_cover, sort_order } = req.body;

//     if (!image_url) {
//       return next(createError('image_url is required.', 400));
//     }

//     const trek = await pool.query('SELECT id FROM treks WHERE id = $1', [id]);
//     if (trek.rows.length === 0) {
//       return next(createError('Trek not found.', 404));
//     }

//     if (is_cover === true) {
//       await pool.query('UPDATE trek_images SET is_cover = FALSE WHERE trek_id = $1', [id]);
//       await pool.query('UPDATE treks SET cover_image = $1 WHERE id = $2', [image_url, id]);
//     }

//     const result = await pool.query(
//       `INSERT INTO trek_images (trek_id, image_url, caption, is_cover, sort_order)
//        VALUES ($1,$2,$3,$4,$5) RETURNING *`,
//       [id, image_url, caption || null, is_cover || false, sort_order || 0]
//     );

//     res.status(201).json({ success: true, data: result.rows[0] });
//   } catch (err) {
//     next(err);
//   }
// };

// // ============================================
// // DELETE /api/treks/images/:imageId  (Admin)
// // ============================================
// const deleteTrekImage = async (req, res, next) => {
//   try {
//     const { imageId } = req.params;

//     const result = await pool.query(
//       'DELETE FROM trek_images WHERE id = $1 RETURNING id, trek_id, is_cover',
//       [imageId]
//     );

//     if (result.rows.length === 0) {
//       return next(createError('Image not found.', 404));
//     }

//     res.json({ success: true, message: 'Image deleted successfully.' });
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = {
//   getAllTreks,
//   getTrekBySlug,
//   createTrek,
//   updateTrek,
//   deleteTrek,
//   getTrekById,
//   getHomepageTrek,
//   addTrekImage,
//   deleteTrekImage,
// };

const pool = require('../config/db');
const { createError } = require('../middleware/errorMiddleware');

// These are managed EXCLUSIVELY through updateTrek — never at creation time.
// Keeping this list in one place also makes updateTrek's whitelist below easy to audit.
const MANAGED_VISIBILITY_FIELDS = [
  'is_homepage',
  'is_featured',
  'is_expedition',
  'is_active',
  'show_in_menu',
  'is_promo',
];

// ============================================
// GET /api/treks  — list + filter + paginate
// ============================================
const getAllTreks = async (req, res, next) => {
  try {
    const { region, difficulty, featured, search, page = 1, limit = 10 } = req.query;

    let conditions = ['t.is_active = TRUE'];
    let params = [];
    let paramCount = 1;

    // `region` now refers to regions.slug (e.g. "everest"), not free text.
    if (region) {
      conditions.push(`r.slug = $${paramCount}`);
      params.push(region);
      paramCount++;
    }

    if (difficulty) {
      conditions.push(`t.difficulty = $${paramCount}`);
      params.push(difficulty);
      paramCount++;
    }

    if (featured === 'true') {
      conditions.push(`t.is_featured = TRUE`);
    }

    if (search) {
      conditions.push(`(t.title ILIKE $${paramCount} OR t.description ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const query = `
      SELECT
        t.id, t.title, t.slug, t.difficulty, t.duration_days,
        t.max_altitude, t.price, t.discount_price,
        r.id AS region_id, r.name AS region_name, r.slug AS region_slug,
        t.cover_image, t.is_featured, t.is_homepage, t.is_expedition,
        ROUND(AVG(rv.rating), 1) AS avg_rating,
        COUNT(DISTINCT rv.id) AS review_count
      FROM treks t
      LEFT JOIN regions r ON r.id = t.region_id
      LEFT JOIN reviews rv ON rv.trek_id = t.id AND rv.is_approved = TRUE
      ${whereClause}
      GROUP BY t.id, r.id, r.name, r.slug
      ORDER BY t.is_featured DESC, t.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    // NOTE: count query needs the same join as the filter now references r.slug
    const countQuery = `
      SELECT COUNT(DISTINCT t.id) FROM treks t
      LEFT JOIN regions r ON r.id = t.region_id
      ${whereClause}
    `;

    const [treksResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, params.slice(0, -2)),
    ]);

    const total = parseInt(countResult.rows[0].count, 10);

    res.json({
      success: true,
      data: treksResult.rows,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ============================================
// GET /api/treks/:slug  — public detail page
// ============================================
const getTrekBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const trekResult = await pool.query(
      `SELECT
        t.*,
        r.name AS region_name, r.slug AS region_slug, r.tagline AS region_tagline,
        ROUND(AVG(rv.rating), 1) AS avg_rating,
        COUNT(DISTINCT rv.id) AS review_count
       FROM treks t
       LEFT JOIN regions r ON r.id = t.region_id
       LEFT JOIN reviews rv ON rv.trek_id = t.id AND rv.is_approved = TRUE
       WHERE t.slug = $1 AND t.is_active = TRUE
       GROUP BY t.id, r.id`,
      [slug]
    );

    if (trekResult.rows.length === 0) {
      return next(createError('Trek not found.', 404));
    }

    const trek = trekResult.rows[0];

    const imagesResult = await pool.query(
      'SELECT * FROM trek_images WHERE trek_id = $1 ORDER BY is_cover DESC, sort_order ASC',
      [trek.id]
    );

    const reviewsResult = await pool.query(
      `SELECT r.*, u.name AS user_name, u.avatar_url
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.trek_id = $1 AND r.is_approved = TRUE
       ORDER BY r.created_at DESC
       LIMIT 10`,
      [trek.id]
    );

    res.json({
      success: true,
      data: { ...trek, images: imagesResult.rows, reviews: reviewsResult.rows },
    });
  } catch (err) {
    next(err);
  }
};

// ============================================
// POST /api/treks  (Admin)
// Step 1 of the workflow: core trek info only. Images are attached
// afterward, per-image, via POST /api/images/trek/:trekId (imageController) —
// that controller already owns writing treks.cover_image when an upload
// is marked is_cover, so this stays a single plain insert with no image
// logic and no transaction is needed. Visibility/marketing flags are
// intentionally rejected here — they belong to updateTrek.
// ============================================
const createTrek = async (req, res, next) => {
  try {
    const {
      title, slug, description, highlights, itinerary,
      difficulty, duration_days, max_altitude, distance_km,
      price, discount_price, max_group_size, min_group_size,
      region_id, start_location, end_location,
      meta_title, meta_description,
    } = req.body;

    if (!title || !slug || !description || !difficulty || !duration_days || !price) {
      return next(createError(
        'Title, slug, description, difficulty, duration and price are required.', 400
      ));
    }

    const rejected = MANAGED_VISIBILITY_FIELDS.filter((f) => req.body[f] !== undefined);
    if (rejected.length > 0) {
      return next(createError(
        `These fields are set via Update Trek, not on creation: ${rejected.join(', ')}`, 400
      ));
    }

    const result = await pool.query(
      `INSERT INTO treks (
        title, slug, description, highlights, itinerary,
        difficulty, duration_days, max_altitude, distance_km,
        price, discount_price, max_group_size, min_group_size,
        region_id, start_location, end_location,
        meta_title, meta_description
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18
      ) RETURNING *`,
      [
        title, slug, description,
        highlights || null,
        itinerary ? JSON.stringify(itinerary) : null,
        difficulty, duration_days, max_altitude || null,
        distance_km || null, price, discount_price || null,
        max_group_size || 12, min_group_size || 1,
        region_id || null, start_location || null, end_location || null,
        meta_title || null, meta_description || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Trek created successfully. Upload images against this id next.',
      data: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return next(createError('A trek with this slug already exists.', 409));
    }
    if (err.code === '23503') {
      return next(createError('Invalid region_id — that region does not exist.', 400));
    }
    next(err);
  }
};

// ============================================
// PUT /api/treks/:id  (Admin)
// Step 2 of the workflow: edit core fields if needed, and manage all
// visibility/marketing settings (is_homepage, is_featured, is_expedition,
// is_active, show_in_menu, menu_order, is_promo) plus region_id.
// ============================================
const updateTrek = async (req, res, next) => {
  const { id } = req.params;

  const fields = [
    // core info — editable later for corrections, but not the focus of this step
    'title', 'slug', 'description', 'highlights', 'itinerary',
    'difficulty', 'duration_days', 'max_altitude', 'distance_km',
    'price', 'discount_price', 'max_group_size', 'min_group_size',
    'region_id', 'start_location', 'end_location', 'cover_image',
    'meta_title', 'meta_description',
    // visibility / marketing settings — this is the primary purpose of updateTrek
    'is_homepage', 'is_featured', 'is_expedition', 'is_active',
    'show_in_menu', 'menu_order', 'is_promo',
  ];

  const updates = [];
  const values = [];
  let paramCount = 1;

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      let value = req.body[field];
      if (field === 'itinerary' && value !== null) value = JSON.stringify(value);
      updates.push(`${field} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  });

  if (updates.length === 0) {
    return next(createError('No valid fields to update.', 400));
  }

  const client = await pool.connect();
  try {
    const existing = await client.query('SELECT id FROM treks WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return next(createError('Trek not found.', 404));
    }

    await client.query('BEGIN');

    // Only one trek may be the homepage trek at a time — clear the rest first.
    if (req.body.is_homepage === true) {
      await client.query('UPDATE treks SET is_homepage = FALSE WHERE id != $1', [id]);
    }

    values.push(id);
    const result = await client.query(
      `UPDATE treks SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Trek updated successfully.',
      data: result.rows[0],
    });
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') {
      return next(createError('A trek with this slug already exists.', 409));
    }
    if (err.code === '23503') {
      return next(createError('Invalid region_id — that region does not exist.', 400));
    }
    next(err);
  } finally {
    client.release();
  }
};

// ============================================
// DELETE /api/treks/:id  (Admin)
// trek_images cascade automatically; bookings/reviews RESTRICT the delete.
// ============================================
const deleteTrek = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM treks WHERE id = $1 RETURNING id, title',
      [id]
    );

    if (result.rows.length === 0) {
      return next(createError('Trek not found.', 404));
    }

    res.json({
      success: true,
      message: `Trek "${result.rows[0].title}" deleted successfully.`,
    });
  } catch (err) {
    if (err.code === '23503') {
      return next(createError(
        'Cannot delete this trek — it has existing bookings or reviews.', 409
      ));
    }
    next(err);
  }
};

// ============================================
// GET /api/treks/id/:id  (Admin — raw record for edit forms)
// ============================================
const getTrekById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trekResult = await pool.query(
      `SELECT t.*, r.name AS region_name, r.slug AS region_slug
       FROM treks t
       LEFT JOIN regions r ON r.id = t.region_id
       WHERE t.id = $1`,
      [id]
    );

    if (trekResult.rows.length === 0) {
      return next(createError('Trek not found.', 404));
    }

    const imagesResult = await pool.query(
      'SELECT * FROM trek_images WHERE trek_id = $1 ORDER BY is_cover DESC, sort_order ASC',
      [id]
    );

    res.json({ success: true, data: { ...trekResult.rows[0], images: imagesResult.rows } });
  } catch (err) {
    next(err);
  }
};

// ============================================
// GET /api/treks/homepage  — public
// ============================================
const getHomepageTrek = async (req, res, next) => {
  try {
    // ORDER/LIMIT is a defensive fallback; updateTrek guarantees at most one
    // row has is_homepage = TRUE, but this keeps the endpoint safe regardless.
    const result = await pool.query(
      `SELECT t.*, r.name AS region_name, r.slug AS region_slug
       FROM treks t
       LEFT JOIN regions r ON r.id = t.region_id
       WHERE t.is_homepage = TRUE
       ORDER BY t.updated_at DESC
       LIMIT 1`
    );

    res.status(200).json({
      success: true,
      data: result.rows[0] || null,
    });
  } catch (err) {
    next(err);
  }
};

// ============================================
// POST /api/treks/:id/images  (Admin — add a gallery image after creation)
// ============================================
const addTrekImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { image_url, caption, is_cover, sort_order } = req.body;

    if (!image_url) {
      return next(createError('image_url is required.', 400));
    }

    const trek = await pool.query('SELECT id FROM treks WHERE id = $1', [id]);
    if (trek.rows.length === 0) {
      return next(createError('Trek not found.', 404));
    }

    if (is_cover === true) {
      await pool.query('UPDATE trek_images SET is_cover = FALSE WHERE trek_id = $1', [id]);
      await pool.query('UPDATE treks SET cover_image = $1 WHERE id = $2', [image_url, id]);
    }

    const result = await pool.query(
      `INSERT INTO trek_images (trek_id, image_url, caption, is_cover, sort_order)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [id, image_url, caption || null, is_cover || false, sort_order || 0]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ============================================
// DELETE /api/treks/images/:imageId  (Admin)
// ============================================
const deleteTrekImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;

    const result = await pool.query(
      'DELETE FROM trek_images WHERE id = $1 RETURNING id, trek_id, is_cover',
      [imageId]
    );

    if (result.rows.length === 0) {
      return next(createError('Image not found.', 404));
    }

    res.json({ success: true, message: 'Image deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTreks,
  getTrekBySlug,
  createTrek,
  updateTrek,
  deleteTrek,
  getTrekById,
  getHomepageTrek,
  addTrekImage,
  deleteTrekImage,
};