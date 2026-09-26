const pool = require('../config/db');
const { createError } = require('../middleware/errorMiddleware');

// ============================================
// GET /api/regions
// Public — used by the mega menu AND by the admin "New Trek" form
// to populate the region_id dropdown.
// ============================================
const getAllRegions = async (req, res, next) => {
  try {
    const { active } = req.query;

    // Admin forms want every region (even inactive ones, so an old trek's
    // region still shows up); the public mega menu wants only active ones.
    const whereClause = active === 'true' ? 'WHERE is_active = TRUE' : '';

    const result = await pool.query(
      `SELECT id, name, slug, tagline, display_order, is_active
       FROM regions
       ${whereClause}
       ORDER BY display_order ASC, name ASC`
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

// ============================================
// GET /api/regions/:slug
// Public — region landing page (e.g. /treks?region=everest header info)
// ============================================
const getRegionBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      'SELECT * FROM regions WHERE slug = $1',
      [slug]
    );

    if (result.rows.length === 0) {
      return next(createError('Region not found.', 404));
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ============================================
// POST /api/regions  (Admin)
// ============================================
const createRegion = async (req, res, next) => {
  try {
    const { name, slug, tagline, display_order } = req.body;

    if (!name || !slug) {
      return next(createError('Name and slug are required.', 400));
    }

    const result = await pool.query(
      `INSERT INTO regions (name, slug, tagline, display_order)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, slug, tagline || null, display_order || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Region created successfully.',
      data: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return next(createError('A region with this slug already exists.', 409));
    }
    next(err);
  }
};

// ============================================
// PUT /api/regions/:id  (Admin)
// ============================================
const updateRegion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const fields = ['name', 'slug', 'tagline', 'display_order', 'is_active'];
    const updates = [];
    const values = [];
    let paramCount = 1;

    fields.forEach((field) => {
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
      `UPDATE regions SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return next(createError('Region not found.', 404));
    }

    res.json({
      success: true,
      message: 'Region updated successfully.',
      data: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return next(createError('A region with this slug already exists.', 409));
    }
    next(err);
  }
};

// ============================================
// DELETE /api/regions/:id  (Admin)
// treks.region_id has no ON DELETE clause defined in the schema, so
// Postgres defaults to RESTRICT — deleting a region in use will 23503.
// ============================================
const deleteRegion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM regions WHERE id = $1 RETURNING id, name',
      [id]
    );

    if (result.rows.length === 0) {
      return next(createError('Region not found.', 404));
    }

    res.json({
      success: true,
      message: `Region "${result.rows[0].name}" deleted successfully.`,
    });
  } catch (err) {
    if (err.code === '23503') {
      return next(createError(
        'Cannot delete this region — treks are still assigned to it.', 409
      ));
    }
    next(err);
  }
};

module.exports = {
  getAllRegions,
  getRegionBySlug,
  createRegion,
  updateRegion,
  deleteRegion,
};