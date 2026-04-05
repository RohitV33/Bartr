const router    = require('express').Router();
const multer    = require('multer');
const cloudinary = require('cloudinary').v2;
const auth      = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload  = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/image', auth, upload.single('file'), async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'bartr', resource_type: 'auto' },
        (err, result) => err ? reject(err) : resolve(result)
      );
      stream.end(req.file.buffer);
    });
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch(e) { res.status(500).json({ error: 'Upload failed' }); }
});

module.exports = router;
