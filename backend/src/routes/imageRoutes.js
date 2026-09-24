
const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { trekUpload }         = require('../config/cloudinary');
const {
  uploadTrekImage, deleteTrekImage,
  getTrekImages,   setCoverImage,
} = require('../controllers/imageController');

// Public
router.get('/trek/:trekId', getTrekImages);


// Upload with explicit multer error catching
router.post('/trek/:trekId', protect, adminOnly, (req, res, next) => {
  console.log('📥 POST /images/trek/:trekId hit');
  console.log('   Content-Type:', req.headers['content-type']);
  console.log('   trekId      :', req.params.trekId);

  trekUpload.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error type    :', err.constructor.name);
      console.error('❌ Multer error message :', err.message);
      console.error('❌ Multer error code    :', err.code);
      return res.status(500).json({
        success: false,
        message: err.message,
        code:    err.code,
        type:    err.constructor.name,
      });
    }
    console.log('✅ Multer finished — passing to controller');
    uploadTrekImage(req, res, next);
  });
});

router.put('/:trekId/cover/:imageId', protect, adminOnly, setCoverImage);
router.delete('/:imageId',            protect, adminOnly, deleteTrekImage);

module.exports = router;