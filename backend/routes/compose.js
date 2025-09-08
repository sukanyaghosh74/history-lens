const express = require('express');
const path = require('path');
const { createSlideshow } = require('../utils/ffmpegUtils');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { images, audioPath, durationPerImage } = req.body;
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }
    const resolvedImages = images.map(img => path.join(__dirname, '..', img.replace(/^\/outputs\//, 'outputs/')));
    const outputName = `video_${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, '../outputs', outputName);
    await createSlideshow(resolvedImages, audioPath, outputPath, durationPerImage || 2);
    res.json({ videoUrl: `/outputs/${outputName}` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
