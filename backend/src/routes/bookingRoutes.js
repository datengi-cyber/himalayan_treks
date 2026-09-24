const express = require('express');
const router = express.Router();
const {
  createBooking, getMyBookings, cancelBooking,
  getAllBookings, updateBookingStatus
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// User routes (must be logged in)
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllBookings);
router.put('/admin/:id/status', protect, adminOnly, updateBookingStatus);

module.exports = router;