const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  createReview, getAllReviews,
  approveReview, deleteReview, getReviewsByTrek
} = require('../controllers/reviewController');

router.get('/trek/:trekId', getReviewsByTrek)

router.post('/', protect, createReview);
router.get('/admin/all', protect, adminOnly, getAllReviews);
router.put('/admin/:id/approve', protect, adminOnly, approveReview);
router.delete('/:id', protect, adminOnly, deleteReview);


module.exports = router;
