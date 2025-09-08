const axios = require('axios');
const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-latest';

// Example Gemini text-to-image request shape:
// POST /text-to-image
// { prompt: 'A person in ancient Rome', seed: 123, ... }
// Response: { images: [ { base64Data, era } ] }

async function generateVariants(filePath, caption, eras, count) {
  if (!GEMINI_API_KEY) return getDemoVariants();
  const seed = Math.floor(Math.random() * 1e9);
  const fileData = fs.readFileSync(filePath, { encoding: 'base64' });
  const variants = [];
  for (let i = 0; i < eras.length; i++) {
    const era = eras[i];
    let retries = 0;
    while (retries < 3) {
      try {
        const res = await axios.post(
          `${GEMINI_BASE_URL}:text-to-image?key=${GEMINI_API_KEY}`,
          {
            prompt: `${caption} in ${era} style`,
            image: fileData,
            seed,
            style: era
          },
          { timeout: 30000 }
        );
        // Response: { images: [ { base64Data } ] }
        const img = res.data.images[0];
        const outName = `variant_${era}_${Date.now()}.png`;
        const outPath = path.join(__dirname, '../outputs', outName);
        fs.writeFileSync(outPath, Buffer.from(img.base64Data, 'base64'));
        variants.push({ url: `/outputs/${outName}`, era });
        break;
      } catch (err) {
        if (err.response && err.response.status === 429) {
          const error = new Error('Gemini API rate limit reached. Please try again later.');
          error.isApiLimit = true;
          throw error;
        }
        if (err.response && err.response.status >= 500) {
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, retries)));
          retries++;
        } else {
          throw err;
        }
      }
    }
  }
  return variants;
}

// Example Gemini edit request shape:
// POST /edit-image
// { image: <base64>, prompt: 'add Roman soldiers', seed: 123 }
// Response: { images: [ { base64Data } ] }

async function editImage(imagePath, prompt) {
  if (!GEMINI_API_KEY) return getDemoEdit(imagePath, prompt);
  const seed = Math.floor(Math.random() * 1e9);
  const fileData = fs.readFileSync(path.join(__dirname, '..', imagePath.replace(/^\/outputs\//, 'outputs/')),{ encoding: 'base64' });
  let retries = 0;
  while (retries < 3) {
    try {
      const res = await axios.post(
        `${GEMINI_BASE_URL}:edit-image?key=${GEMINI_API_KEY}`,
        {
          image: fileData,
          prompt,
          seed
        },
        { timeout: 30000 }
      );
      const img = res.data.images[0];
      const outName = `edit_${Date.now()}.png`;
      const outPath = path.join(__dirname, '../outputs', outName);
      fs.writeFileSync(outPath, Buffer.from(img.base64Data, 'base64'));
      return { url: `/outputs/${outName}` };
    } catch (err) {
      if (err.response && err.response.status === 429) {
        const error = new Error('Gemini API rate limit reached. Please try again later.');
        error.isApiLimit = true;
        throw error;
      }
      if (err.response && err.response.status >= 500) {
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, retries)));
        retries++;
      } else {
        throw err;
      }
    }
  }
}

// Demo mode: return sample images from sample_data
function getDemoVariants() {
  // Assume sample_data/ancient.jpg, medieval.jpg, futuristic.jpg exist
  return {
    original: { url: '/sample_data/original.jpg' },
    variants: [
      { url: '/sample_data/ancient.jpg', era: 'Ancient' },
      { url: '/sample_data/medieval.jpg', era: 'Medieval' },
      { url: '/sample_data/futuristic.jpg', era: 'Futuristic' }
    ]
  };
}
function getDemoEdit(imagePath, prompt) {
  // Just return the same image for demo
  return { url: imagePath };
}

module.exports = { generateVariants, editImage, getDemoVariants, getDemoEdit };
