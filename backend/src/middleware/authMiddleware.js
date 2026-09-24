const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { createError } = require('../middleware/errorMiddleware');
// Protect any route — user must be logged in
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError('Not authorized. No token provided.', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (without password)
    const result = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return next(createError('User no longer exists.', 401));
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    return next(createError('Invalid or expired token.', 401));
  }
};

// Restrict to admin only
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(createError('Access denied. Admins only.', 403));
  }
  next();
};

module.exports = { protect, adminOnly };