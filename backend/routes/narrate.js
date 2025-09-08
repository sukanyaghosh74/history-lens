const express = require('express');
const { textToSpeech } = require('../utils/elevenLabsClient');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(204).json({ message: 'TTS disabled' });
    }
    const { text, voice } = req.body;
    if (!text) return res.status(400).json({ error: 'Missing text' });
    const mp3Path = await textToSpeech(text, voice);
    res.json({ audioUrl: `/outputs/${mp3Path}` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
