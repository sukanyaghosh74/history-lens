const express = require('express');
const { editImage, getDemoEdit } = require('../utils/geminiClient');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { imagePath, editPrompt } = req.body;
    if (!imagePath || !editPrompt) return res.status(400).json({ error: 'Missing imagePath or editPrompt' });
    // Demo mode
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ editedImage: getDemoEdit(imagePath, editPrompt) });
    }
    const editedImage = await editImage(imagePath, editPrompt);
    res.json({ editedImage });
  } catch (err) {
    if (err.isApiLimit) {
      return res.status(429).json({ error: err.message });
    }
    next(err);
  }
});

module.exports = router;
