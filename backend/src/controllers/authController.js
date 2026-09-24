const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { createError } = require('../middleware/errorMiddleware');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// ─── REGISTER ────────────────────────────────────────────
// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return next(createError('Name, email and password are required.', 400));
    }

    if (password.length < 6) {
      return next(createError('Password must be at least 6 characters.', 400));
    }

    // Check if email already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existing.rows.length > 0) {
      return next(createError('Email already registered.', 409));
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email.toLowerCase(), hashedPassword, phone || null]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user
    });
  } catch (err) {
    next(err);
  }
};

// ─── LOGIN ───────────────────────────────────────────────
// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError('Email and password are required.', 400));
    }

    // Find user by email (include password for comparison)
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return next(createError('Invalid email or password.', 401));
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createError('Invalid email or password.', 401));
    }

    const token = generateToken(user.id);

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET CURRENT USER ────────────────────────────────────
// GET /api/auth/me  (protected)
const getMe = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, phone, avatar_url, nationality, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// ─── UPDATE PROFILE ──────────────────────────────────────
// PUT /api/auth/profile  (protected)
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, nationality } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           nationality = COALESCE($3, nationality)
       WHERE id = $4
       RETURNING id, name, email, role, phone, nationality`,
      [name, phone, nationality, req.user.id]
    );

    res.json({
      success: true,
      message: 'Profile updated.',
      user: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN: GET ALL USERS ────────────────────────────────
// GET /api/auth/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    let where = '';
    let params = [limit, offset];

    if (search) {
      where = 'WHERE name ILIKE $3 OR email ILIKE $3';
      params.push(`%${search}%`);
    }

    const result = await pool.query(
      `SELECT id, name, email, role, phone, is_verified, created_at
       FROM users ${where}
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      params
    );

    const count = await pool.query(
      `SELECT COUNT(*) FROM users ${where}`,
      search ? [`%${search}%`] : []
    );

    res.json({
      success: true,
      data: result.rows,
      total: parseInt(count.rows[0].count)
    });
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN: UPDATE USER ROLE ─────────────────────────────
// PUT /api/auth/admin/users/:id/role
const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return next(createError('Invalid role.', 400));
    }

    // Prevent admin from demoting themselves
    if (parseInt(id) === req.user.id) {
      return next(createError('You cannot change your own role.', 400));
    }

    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, id]
    );

    if (result.rows.length === 0) {
      return next(createError('User not found.', 404));
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};


module.exports = { register, login, getMe, updateProfile , getAllUsers, updateUserRole };