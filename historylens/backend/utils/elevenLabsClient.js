const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// Example request:
// POST /v1/text-to-speech/{voice}
// Headers: 'xi-api-key': <API_KEY>
// Body: { text: 'Hello world' }
// Response: audio/mp3

async function textToSpeech(text, voice = 'Rachel') {
  if (!ELEVENLABS_API_KEY) {
    const err = new Error('TTS disabled');
    err.isTTSDisabled = true;
    throw err;
  }
  const url = `${ELEVENLABS_BASE_URL}/${voice}`;
  const outName = `narration_${Date.now()}.mp3`;
  const outPath = path.join(__dirname, '../outputs', outName);
  const res = await axios.post(url, { text }, {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json'
    },
    responseType: 'arraybuffer',
    timeout: 30000
  });
  fs.writeFileSync(outPath, res.data);
  return outName;
}

module.exports = { textToSpeech };
