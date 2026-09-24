const express = require('express');
const router = express.Router();
const { getExpeditionsMenu } = require('../controllers/navController');

// Public — mega menu data, no auth needed
router.get('/expeditions', getExpeditionsMenu);

module.exports = router;