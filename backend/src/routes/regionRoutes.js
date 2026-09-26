const express = require('express');
const router = express.Router();

const {
  getAllRegions,
  getRegionBySlug,
  createRegion,
  updateRegion,
  deleteRegion,
} = require('../controllers/regionController')
const { protect, adminOnly } = require('../middleware/authMiddleware');


router.get('/', getAllRegions);
router.get('/:slug', getRegionBySlug);

router.post('/',  protect, adminOnly, createRegion);
router.put('/:id',  protect, adminOnly,updateRegion);
router.delete('/:id',  protect, adminOnly, deleteRegion);

module.exports = router;