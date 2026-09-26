

// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key:    process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const trekStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder:          'himalaya-treks/treks',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//     transformation: [
//       {
//         width:        1200,
//         height:       800,
//         crop:         'fill',
//         quality:      'auto',
//         fetch_format: 'auto'
//       }
//     ],
//   },
// });
// const blogStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder:          'himalaya-treks/blog',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//     transformation: [
//       {
//         width:        1200,
//         height:       630,
//         crop:         'fill',
//         quality:      'auto',
//         fetch_format: 'auto'
//       }
//     ],
//   },
// });

// const trekUpload = multer({
//   storage: trekStorage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
// });

// const blogUpload = multer({
//   storage: blogStorage,
//   limits: { fileSize: 10 * 1024 * 1024 },
// });

// module.exports = { cloudinary, trekUpload, blogUpload };


const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// multer's storage engine — files are streamed straight to Cloudinary,
// so req.file.path in imageController is already the secure_url.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'treks',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  },
});

module.exports = { cloudinary, storage };