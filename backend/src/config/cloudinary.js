// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');

// // Configure Cloudinary credentials
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key:    process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Trek images storage — stored in 'himalaya-treks/treks' folder on Cloudinary
// const trekImageStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'himalaya-treks/treks',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//     transformation: [
//       { width: 1200, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'auto' }
//     ],
//   },
// });

// // Blog images storage
// const blogImageStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'himalaya-treks/blog',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//     transformation: [
//       { width: 1200, height: 630, crop: 'fill', quality: 'auto', fetch_format: 'auto' }
//     ],
//   },
// });

// // Multer upload instances
// const uploadTrekImage = multer({
//   storage: trekImageStorage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
// });

// const uploadBlogImage = multer({
//   storage: blogImageStorage,
//   limits: { fileSize: 10 * 1024 * 1024 },
// });

// module.exports = { cloudinary, uploadTrekImage, uploadBlogImage };


const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const trekStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'himalaya-treks/treks',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      {
        width:        1200,
        height:       800,
        crop:         'fill',
        quality:      'auto',
        fetch_format: 'auto'
      }
    ],
  },
});
const blogStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'himalaya-treks/blog',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      {
        width:        1200,
        height:       630,
        crop:         'fill',
        quality:      'auto',
        fetch_format: 'auto'
      }
    ],
  },
});

const trekUpload = multer({
  storage: trekStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const blogUpload = multer({
  storage: blogStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = { cloudinary, trekUpload, blogUpload };