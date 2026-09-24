const pool = require('../config/db');
const { createError } = require('../middleware/errorMiddleware');

// ─── CREATE BOOKING ──────────────────────────────────────
// POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const { trek_id, booking_date, num_travelers, special_requests, emergency_contact } = req.body;
    const user_id = req.user.id;

    if (!trek_id || !booking_date || !num_travelers) {
      return next(createError('Trek, booking date and number of travelers are required.', 400));
    }

    // Get trek to calculate price & validate
    const trekResult = await pool.query(
      'SELECT id, title, price, discount_price, max_group_size, is_active FROM treks WHERE id = $1',
      [trek_id]
    );

    if (trekResult.rows.length === 0) {
      return next(createError('Trek not found.', 404));
    }

    const trek = trekResult.rows[0];

    if (!trek.is_active) {
      return next(createError('This trek is currently unavailable.', 400));
    }

    if (num_travelers > trek.max_group_size) {
      return next(createError(`Maximum group size for this trek is ${trek.max_group_size}.`, 400));
    }

    // Use discounted price if available
    const pricePerPerson = trek.discount_price || trek.price;
    const total_price = pricePerPerson * num_travelers;

    const result = await pool.query(
      `INSERT INTO bookings
        (user_id, trek_id, booking_date, num_travelers, total_price, special_requests, emergency_contact)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user_id, trek_id, booking_date, num_travelers, total_price, special_requests || null, emergency_contact || null]
    );

    res.status(201).json({
      success: true,
      message: `Booking for "${trek.title}" created successfully.`,
      data: result.rows[0]
    });
  } catch (err) {
    if (err.code === '23505') {
      return next(createError('You already have a booking for this trek on that date.', 409));
    }
    next(err);
  }
};

// ─── GET MY BOOKINGS ─────────────────────────────────────
// GET /api/bookings/my
const getMyBookings = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT
        b.*,
        t.title AS trek_title,
        t.slug AS trek_slug,
        t.cover_image,
        t.duration_days,
        t.region
       FROM bookings b
       JOIN treks t ON t.id = b.trek_id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
};

// ─── CANCEL BOOKING ──────────────────────────────────────
// PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      'SELECT * FROM bookings WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (existing.rows.length === 0) {
      return next(createError('Booking not found.', 404));
    }

    if (existing.rows[0].status === 'cancelled') {
      return next(createError('Booking is already cancelled.', 400));
    }

    if (existing.rows[0].status === 'completed') {
      return next(createError('Cannot cancel a completed booking.', 400));
    }

    const result = await pool.query(
      `UPDATE bookings SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [id]
    );

    res.json({
      success: true,
      message: 'Booking cancelled successfully.',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN: GET ALL BOOKINGS ─────────────────────────────
// GET /api/bookings/admin/all
const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let conditions = [];
    let params = [];
    let paramCount = 1;

    if (status) {
      conditions.push(`b.status = $${paramCount}`);
      params.push(status);
      paramCount++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    params.push(limit, offset);

    const result = await pool.query(
      `SELECT
        b.*,
        u.name AS user_name, u.email AS user_email,
        t.title AS trek_title, t.region
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       JOIN treks t ON t.id = b.trek_id
       ${whereClause}
       ORDER BY b.created_at DESC
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      params
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN: UPDATE BOOKING STATUS ────────────────────────
// PUT /api/bookings/admin/:id/status
const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, payment_status, notes } = req.body;

    const result = await pool.query(
      `UPDATE bookings
       SET
         status = COALESCE($1, status),
         payment_status = COALESCE($2, payment_status),
         notes = COALESCE($3, notes)
       WHERE id = $4
       RETURNING *`,
      [status || null, payment_status || null, notes || null, id]
    );

    if (result.rows.length === 0) {
      return next(createError('Booking not found.', 404));
    }

    res.json({
      success: true,
      message: 'Booking updated.',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking, getMyBookings, cancelBooking,
  getAllBookings, updateBookingStatus
};