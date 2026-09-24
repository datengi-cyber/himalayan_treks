const express = require('express');
const router = express.Router();
const {
  getAllTreks, getTrekBySlug,
  createTrek, updateTrek, deleteTrek, getTrekById, getHomepageTrek
} = require('../controllers/trekController');
const { protect, adminOnly } = require('../middleware/authMiddleware');


// Public routes
router.get('/', getAllTreks);
router.get('/homepage', getHomepageTrek);
router.get('/id/:id', protect, adminOnly, getTrekById);
router.get('/:slug', getTrekBySlug);

// Admin only routes
router.post('/', protect, adminOnly, createTrek);
router.put('/:id', protect, adminOnly, updateTrek);
router.delete('/:id', protect, adminOnly, deleteTrek);

module.exports = router;