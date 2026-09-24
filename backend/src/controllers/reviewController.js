const pool = require('../config/db');
const { createError } = require('../middleware/errorMiddleware');

// POST /api/reviews  — logged in user submits review
const createReview = async (req, res, next) => {
  try {
    const { trek_id, rating, title, comment } = req.body;
    const user_id = req.user.id;

    if (!trek_id || !rating) {
      return next(createError('Trek and rating are required.', 400));
    }

    // Only allow review if user has a completed booking for this trek
    const booking = await pool.query(
      `SELECT id FROM bookings
       WHERE user_id = $1 AND trek_id = $2 AND status = 'completed'`,
      [user_id, trek_id]
    );

    if (booking.rows.length === 0) {
      return next(createError('You can only review treks you have completed.', 403));
    }

    const result = await pool.query(
      `INSERT INTO reviews (user_id, trek_id, rating, title, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, trek_id, rating, title || null, comment || null]
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted. Pending admin approval.',
      data: result.rows[0]
    });
  } catch (err) {
    if (err.code === '23505') {
      return next(createError('You have already reviewed this trek.', 409));
    }
    next(err);
  }
};

// GET /api/reviews/admin/all  — admin sees all pending + approved
const getAllReviews = async (req, res, next) => {
  try {
    const { approved } = req.query;
    let where = '';
    const params = [];

    if (approved !== undefined) {
      where = 'WHERE r.is_approved = $1';
      params.push(approved === 'true');
    }

    const result = await pool.query(
      `SELECT r.*, u.name AS user_name, t.title AS trek_title
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       JOIN treks t ON t.id = r.trek_id
       ${where}
       ORDER BY r.created_at DESC`,
      params
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// PUT /api/reviews/admin/:id/approve
const approveReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_approved } = req.body;

    const result = await pool.query(
      'UPDATE reviews SET is_approved = $1 WHERE id = $2 RETURNING *',
      [is_approved, id]
    );

    if (result.rows.length === 0) {
      return next(createError('Review not found.', 404));
    }

    res.json({
      success: true,
      message: is_approved ? 'Review approved.' : 'Review rejected.',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/reviews/:id  — admin deletes
const deleteReview = async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM reviews WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return next(createError('Review not found.', 404));
    }
    res.json({ success: true, message: 'Review deleted.' });
  } catch (err) {
    next(err);
  }
};
// GET /api/reviews/trek/:trekId
const getReviewsByTrek = async (req, res, next) => {
  try {
    const { trekId } = req.params;

    const result = await pool.query(
      `SELECT
          r.id,
          r.rating,
          r.title,
          r.comment,
          r.created_at,
          u.id AS user_id,
          u.name AS user_name
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.trek_id = $1
         AND r.is_approved = TRUE
       ORDER BY r.created_at DESC`,
      [trekId]
    );

    // Calculate review stats
    const stats = await pool.query(
      `SELECT
          COUNT(*)::int AS total_reviews,
          ROUND(AVG(rating)::numeric, 1) AS average_rating
       FROM reviews
       WHERE trek_id = $1
         AND is_approved = TRUE`,
      [trekId]
    );

    res.json({
      success: true,
      data: {
        reviews: result.rows,
        stats: stats.rows[0]
      }
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { createReview, getAllReviews, approveReview, deleteReview , getReviewsByTrek};