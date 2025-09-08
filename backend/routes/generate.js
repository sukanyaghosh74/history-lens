const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { generateVariants, getDemoVariants } = require('../utils/geminiClient');

const router = express.Router();
const upload = multer({
  dest: path.join(__dirname, '../outputs'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return cb(new Error('Only jpeg, png, or webp images allowed.'));
    }
    cb(null, true);
  }
});

router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    let filePath, originalUrl;
    if (req.file) {
      filePath = req.file.path;
      originalUrl = `/outputs/${path.basename(filePath)}`;
    } else {
      // Demo mode: use sample image
      const demo = getDemoVariants();
      return res.json(demo);
    }
    const caption = req.body.caption || 'A person';
    const eras = req.body.eras || ['ancient', 'medieval', 'futuristic'];
    const samples = parseInt(req.body.samples) || 3;
    const variants = await generateVariants(filePath, caption, eras, samples);
    res.json({ original: { url: originalUrl }, variants });
  } catch (err) {
    if (err.isApiLimit) {
      return res.status(429).json({ error: err.message });
    }
    next(err);
  }
});

module.exports = router;
