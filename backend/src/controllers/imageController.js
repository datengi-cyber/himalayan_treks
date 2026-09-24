const pool = require('../config/db');
const { cloudinary } = require('../config/cloudinary');
const { createError } = require('../middleware/errorMiddleware');

// ─── UPLOAD IMAGE ─────────────────────────────────────────
const uploadTrekImage = async (req, res, next) => {
  try {
    console.log('📸 Upload request received');
    console.log('   params  :', req.params);
    console.log('   body    :', req.body);
    console.log('   req.file:', req.file);

    const { trekId } = req.params;
    const { caption, is_cover, sort_order } = req.body;

    // ── Check 1: Did multer give us a file? ──────────────
    if (!req.file) {
      console.error('❌ req.file is undefined — multer did not process the file');
      return next(createError(
        'No image received. Make sure the field name is exactly "image".',
        400
      ));
    }

    console.log('✅ File received from multer:');
    console.log('   originalname :', req.file.originalname);
    console.log('   mimetype     :', req.file.mimetype);
    console.log('   size         :', req.file.size);
    console.log('   path (URL)   :', req.file.path);
    console.log('   filename     :', req.file.filename);

    // ── Check 2: Did Cloudinary return a URL? ────────────
    const imageUrl = req.file.path || req.file.secure_url;
    if (!imageUrl) {
      console.error('❌ No URL returned from Cloudinary');
      console.error('   req.file full object:', JSON.stringify(req.file, null, 2));
      return next(createError('Cloudinary did not return an image URL.', 500));
    }

    console.log('✅ Cloudinary URL:', imageUrl);

    // ── Check 3: Trek exists? ────────────────────────────
    const trek = await pool.query(
      'SELECT id, title FROM treks WHERE id = $1',
      [trekId]
    );
    if (trek.rows.length === 0) {
      return next(createError(`Trek with id ${trekId} not found.`, 404));
    }
    console.log('✅ Trek found:', trek.rows[0].title);

    const isCover = is_cover === 'true' || is_cover === true;
    console.log('   is_cover:', isCover);

    // ── If cover — unset existing covers ────────────────
    if (isCover) {
      await pool.query(
        'UPDATE trek_images SET is_cover = FALSE WHERE trek_id = $1',
        [trekId]
      );
      await pool.query(
        'UPDATE treks SET cover_image = $1 WHERE id = $2',
        [imageUrl, trekId]
      );
      console.log('✅ Set as cover image on treks table');
    }

    // ── Save to DB ───────────────────────────────────────
    const result = await pool.query(
      `INSERT INTO trek_images
         (trek_id, image_url, caption, is_cover, sort_order)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        trekId,
        imageUrl,
        caption    || null,
        isCover,
        sort_order ? parseInt(sort_order) : 0,
      ]
    );

    console.log('✅ Saved to DB — trek_images id:', result.rows[0].id);

    res.status(201).json({
      success: true,
      message: 'Image uploaded to Cloudinary and saved to database.',
      data:    result.rows[0],
    });

  } catch (err) {
    console.error('❌ uploadTrekImage caught error:', err.message);
    console.error(err.stack);
    next(err);
  }
};

// ─── GET IMAGES ───────────────────────────────────────────
const getTrekImages = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM trek_images
       WHERE trek_id = $1
       ORDER BY is_cover DESC, sort_order ASC`,
      [req.params.trekId]
    );
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

// ─── SET COVER ────────────────────────────────────────────
const setCoverImage = async (req, res, next) => {
  try {
    const { trekId, imageId } = req.params;

    const check = await pool.query(
      'SELECT * FROM trek_images WHERE id = $1 AND trek_id = $2',
      [imageId, trekId]
    );
    if (check.rows.length === 0) {
      return next(createError('Image not found for this trek.', 404));
    }

    await pool.query(
      'UPDATE trek_images SET is_cover = FALSE WHERE trek_id = $1',
      [trekId]
    );
    const result = await pool.query(
      'UPDATE trek_images SET is_cover = TRUE WHERE id = $1 RETURNING *',
      [imageId]
    );
    await pool.query(
      'UPDATE treks SET cover_image = $1 WHERE id = $2',
      [check.rows[0].image_url, trekId]
    );

    res.json({ success: true, message: 'Cover image updated.', data: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE IMAGE ─────────────────────────────────────────
const deleteTrekImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;

    const result = await pool.query(
      'SELECT * FROM trek_images WHERE id = $1',
      [imageId]
    );
    if (result.rows.length === 0) {
      return next(createError('Image not found.', 404));
    }

    const image = result.rows[0];

    // Delete from Cloudinary
    try {
      const urlParts  = image.image_url.split('/');
      const uploadIdx = urlParts.indexOf('upload');
      const publicId  = urlParts
        .slice(uploadIdx + 2)
        .join('/')
        .replace(/\.[^/.]+$/, '');
      console.log('🗑️  Deleting from Cloudinary, publicId:', publicId);
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudErr) {
      console.error('Cloudinary delete warning:', cloudErr.message);
    }

    await pool.query('DELETE FROM trek_images WHERE id = $1', [imageId]);

    if (image.is_cover) {
      await pool.query(
        'UPDATE treks SET cover_image = NULL WHERE id = $1',
        [image.trek_id]
      );
    }

    res.json({ success: true, message: 'Image deleted.' });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  uploadTrekImage,
  getTrekImages,
  setCoverImage,
  deleteTrekImage,
};
