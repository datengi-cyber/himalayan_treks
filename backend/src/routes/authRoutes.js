const express = require('express');
const router = express.Router();
// const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { register, login, getMe, updateProfile, getAllUsers, updateUserRole } = require('../controllers/authController');
const { protect , adminOnly } = require('../middleware/authMiddleware.js');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);


router.get('/admin/users', protect, adminOnly, getAllUsers);
router.put('/admin/users/:id/role', protect, adminOnly, updateUserRole);

module.exports = router;
