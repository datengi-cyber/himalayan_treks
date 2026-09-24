const pool = require('../config/db');
const { createError } = require('../middleware/errorMiddleware');



const getAllTreks = async (req, res, next) => {
  try {
    // Support filtering via query params: ?region=Everest&difficulty=moderate
    const { region, difficulty, featured, search, page = 1, limit = 10 } = req.query;

    let conditions = ['t.is_active = TRUE'];
    let params = [];
    let paramCount = 1;

    if (region) {
      conditions.push(`t.region ILIKE $${paramCount}`);
      params.push(`%${region}%`);
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

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Pagination
    const offset = (page - 1) * limit;
    params.push(limit, offset);

    const query = `
      SELECT
        t.id, t.title, t.slug, t.difficulty, t.duration_days,
        t.max_altitude, t.price, t.discount_price, t.region,
        t.cover_image, t.is_featured,
        ROUND(AVG(r.rating), 1) AS avg_rating,
        COUNT(DISTINCT r.id) AS review_count
      FROM treks t
      LEFT JOIN reviews r ON r.trek_id = t.id AND r.is_approved = TRUE
      ${whereClause}
      GROUP BY t.id
      ORDER BY t.is_featured DESC, t.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    // Count total for pagination
    const countQuery = `
      SELECT COUNT(*) FROM treks t ${whereClause}
    `;

    const [treksResult, countResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, params.slice(0, -2))
    ]);

    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: treksResult.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

const getTrekBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const trekResult = await pool.query(
      `SELECT
        t.*,
        ROUND(AVG(r.rating), 1) AS avg_rating,
        COUNT(DISTINCT r.id) AS review_count
       FROM treks t
       LEFT JOIN reviews r ON r.trek_id = t.id AND r.is_approved = TRUE
       WHERE t.slug = $1 AND t.is_active = TRUE
       GROUP BY t.id`,
      [slug]
    );

    if (trekResult.rows.length === 0) {
      return next(createError('Trek not found.', 404));
    }

    const trek = trekResult.rows[0];

    // Get trek images
    const imagesResult = await pool.query(
      'SELECT * FROM trek_images WHERE trek_id = $1 ORDER BY sort_order ASC',
      [trek.id]
    );

    // Get approved reviews with user name
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
      data: {
        ...trek,
        images: imagesResult.rows,
        reviews: reviewsResult.rows
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── CREATE TREK (Admin) ─────────────────────────────────
// POST /api/treks
const createTrek = async (req, res, next) => {
  try {
    const {
      title, slug, description, highlights, itinerary,
      difficulty, duration_days, max_altitude, distance_km,
      price, discount_price, max_group_size, min_group_size,
      region, start_location, end_location, cover_image,
      is_featured, meta_title, meta_description
    } = req.body;

    if (!title || !slug || !description || !difficulty || !duration_days || !price) {
      return next(createError('Title, slug, description, difficulty, duration and price are required.', 400));
    }

    const result = await pool.query(
      `INSERT INTO treks (
        title, slug, description, highlights, itinerary,
        difficulty, duration_days, max_altitude, distance_km,
        price, discount_price, max_group_size, min_group_size,
        region, start_location, end_location, cover_image,
        is_featured, meta_title, meta_description
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20
      ) RETURNING *`,
      [
        title, slug, description,
        highlights || null,
        itinerary ? JSON.stringify(itinerary) : null,
        difficulty, duration_days, max_altitude || null,
        distance_km || null, price, discount_price || null,
        max_group_size || 12, min_group_size || 1,
        region || null, start_location || null,
        end_location || null, cover_image || null,
        is_featured || false, meta_title || null,
        meta_description || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Trek created successfully.',
      data: result.rows[0]
    });
  } catch (err) {
    // Handle duplicate slug
    if (err.code === '23505') {
      return next(createError('A trek with this slug already exists.', 409));
    }
    next(err);
  }
};

// ─── UPDATE TREK (Admin) ─────────────────────────────────
// PUT /api/treks/:id
const updateTrek = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await pool.query('SELECT id FROM treks WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return next(createError('Trek not found.', 404));
    }

    const fields = [
      'title', 'slug', 'description', 'highlights', 'itinerary',
      'difficulty', 'duration_days', 'max_altitude', 'distance_km',
      'price', 'discount_price', 'max_group_size', 'region',
      'cover_image', 'is_featured', 'is_active',
      'meta_title', 'meta_description'
    ];

    const updates = [];
    const values = [];
    let paramCount = 1;

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = $${paramCount}`);
        values.push(req.body[field]);
        paramCount++;
      }
    });

    if (updates.length === 0) {
      return next(createError('No valid fields to update.', 400));
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE treks SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.json({
      success: true,
      message: 'Trek updated successfully.',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE TREK (Admin) ─────────────────────────────────
// DELETE /api/treks/:id
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
      message: `Trek "${result.rows[0].title}" deleted successfully.`
    });
  } catch (err) {
    next(err);
  }
};


const getTrekById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM treks WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return next(createError('Trek not found.', 404));
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

const getHomepageTrek = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM treks WHERE is_homepage = TRUE LIMIT 1"
    );

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};


module.exports = { getAllTreks, getTrekBySlug, createTrek, updateTrek, deleteTrek , getTrekById, getHomepageTrek};
