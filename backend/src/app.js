const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const navRoutes = require('./routes/navRoutes');
const regionRoutes = require('./routes/regionRoutes')
const trekRoutes = require('./routes/trekRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const imageRoutes = require('./routes/imageRoutes');
const reviewRoutes = require('./routes/reviewRoutes');


const { errorHandler } = require('./middleware/errorMiddleware');
const { protect, adminOnly } = require('./middleware/authMiddleware');

const pool = require('./config/db');

const app = express();   

const allowedOrigins = [
  'http://localhost:3000',
  'https://himalayan-legacy.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// -------------------------
// Health Check
// -------------------------
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    message: 'Himalaya Treks API is running',
  });
});

// -------------------------
// API Routes
// -------------------------
app.use('/api/auth', authRoutes);
app.use('/api/nav', navRoutes);
app.use('/api/regions', regionRoutes);
app.use('/api/treks', trekRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/reviews', reviewRoutes);

// -------------------------
// Admin Dashboard Stats
// -------------------------
app.get('/api/admin/stats', protect, adminOnly, async (req, res, next) => {
  try {
    const [
      users,
      treks,
      bookings,
      revenue,
      pending,
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM treks WHERE is_active = TRUE'),
      pool.query('SELECT COUNT(*) FROM bookings'),
      pool.query(`
        SELECT COALESCE(SUM(total_price), 0) AS revenue
        FROM bookings
        WHERE status != 'cancelled'
      `),
      pool.query(`
        SELECT COUNT(*) FROM bookings
        WHERE status = 'pending'
      `),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers: Number(users.rows[0].count),
        totalTreks: Number(treks.rows[0].count),
        totalBookings: Number(bookings.rows[0].count),
        totalRevenue: Number(revenue.rows[0].revenue),
        pendingBookings: Number(pending.rows[0].count),
      },
    });
  } catch (err) {
    next(err);
  }
});

// -------------------------
// 404 Handler (Must be AFTER all routes)
// -------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

// -------------------------
// Global Error Handler (Always LAST)
// -------------------------
app.use(errorHandler);

module.exports = app;
