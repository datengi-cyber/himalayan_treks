
// const express = require('express');
// const router  = express.Router();
// const { protect, adminOnly } = require('../middleware/authMiddleware');
// const { trekUpload }         = require('../config/cloudinary');
// const {
//   uploadTrekImage, deleteTrekImage,
//   getTrekImages,   setCoverImage,
// } = require('../controllers/imageController');

// // Public
// router.get('/trek/:trekId', getTrekImages);


// // Upload with explicit multer error catching
// router.post('/trek/:trekId', protect, adminOnly, (req, res, next) => {
//   console.log('📥 POST /images/trek/:trekId hit');
//   console.log('   Content-Type:', req.headers['content-type']);
//   console.log('   trekId      :', req.params.trekId);

//   trekUpload.single('image')(req, res, (err) => {
//     if (err) {
//       console.error('❌ Multer error type    :', err.constructor.name);
//       console.error('❌ Multer error message :', err.message);
//       console.error('❌ Multer error code    :', err.code);
//       return res.status(500).json({
//         success: false,
//         message: err.message,
//         code:    err.code,
//         type:    err.constructor.name,
//       });
//     }
//     console.log('✅ Multer finished — passing to controller');
//     uploadTrekImage(req, res, next);
//   });
// });

// router.put('/:trekId/cover/:imageId', protect, adminOnly, setCoverImage);
// router.delete('/:imageId',            protect, adminOnly, deleteTrekImage);

// module.exports = router;

const express = require('express');
const multer = require('multer');
const router = express.Router();

const { storage } = require('../config/cloudinary');
const {
  uploadTrekImage,
  getTrekImages,
  setCoverImage,
  deleteTrekImage,
} = require('../controllers/imageController');

// Adjust to match whatever auth middleware your treks routes use, so only
// admins can upload/delete/set-cover:
// const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

const upload = multer({
  storage, // CloudinaryStorage — file goes straight to Cloudinary, no disk buffer
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Field name must be "image" — matches uploadTrekImage's req.file check
// and the frontend's FormData.append('image', file).
router.post(
  '/trek/:trekId',
  /* authenticate, requireAdmin, */
  upload.single('image'),
  uploadTrekImage
);

router.get('/trek/:trekId', getTrekImages);

router.patch(
  '/trek/:trekId/:imageId/cover',
  /* authenticate, requireAdmin, */
  setCoverImage
);

router.delete('/:imageId', /* authenticate, requireAdmin, */ deleteTrekImage);

module.exports = router;