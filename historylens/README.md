# HistoryLens — Time Travel with Your Photos

## Project Overview
HistoryLens is a web application that lets you travel through time with your photos. Upload a selfie, object, or location, and instantly see it reimagined in different historical eras or even the future using Google Gemini 2.5 Flash Image. Refine your images with natural language edits (e.g., "add Roman soldiers to the background") and add narrated captions with ElevenLabs TTS. Compose a shareable before/after gallery and a narrated slideshow video—all in your browser.

- **No API keys?** Demo mode lets you try with sample images and captions.
- **Tech:** Next.js (React), Node.js/Express, Gemini 2.5 Flash Image, ElevenLabs TTS, ffmpeg, Docker.

---

## Prerequisites
- [Docker](https://www.docker.com/) & [docker-compose](https://docs.docker.com/compose/)
- [ffmpeg](https://ffmpeg.org/) (if running locally, not in Docker)
- Node.js 18+ (for local dev)

---

## Setup & Running

1. **Clone the repo:**
   ```sh
   git clone <your-repo-url> && cd historylens
   ```
2. **Configure environment:**
   ```sh
   cp .env.example .env
   # Edit .env to add your GEMINI_API_KEY and (optionally) ELEVENLABS_API_KEY
   ```
3. **Run with Docker Compose:**
   ```sh
   docker-compose up --build
   # App runs at http://localhost:3000
   ```
   Or, **run locally for development:**
   ```sh
   npm install
   npm run dev
   # Starts both frontend (http://localhost:3000) and backend (http://localhost:5000)
   ```

---

## Demo Mode (No API Keys)
- If you do not set `GEMINI_API_KEY`, the backend serves pre-generated sample images and captions.
- Try the "Try sample images" button on the homepage for an instant demo.

---

## Usage
1. **Upload an image** (max 10MB, jpeg/png/webp) or use a sample.
2. **View gallery**: See your photo in Ancient, Medieval, and Futuristic styles.
3. **Edit**: Click "Edit" on any variant to apply a natural-language change (e.g., "add a spaceship").
4. **Compose video**: Select images, add a caption (optional), and generate a narrated slideshow.
5. **Download**: Save images or video locally.

---

## Troubleshooting
- **API Limit/429 Error:** If Gemini API rate limit is hit, you’ll see a friendly error. Wait and retry, or use demo mode.
- **TTS Disabled:** If no ElevenLabs key is set, narration is disabled and the app will fallback gracefully.
- **Increase logs:** Set `LOG_LEVEL=debug` in `.env` for more verbose backend logs.
- **ffmpeg errors:** Ensure ffmpeg is installed and in your PATH if running outside Docker.

---

## Kaggle Submission Checklist
- [x] Video demo (see demo_script.txt)
- [x] Public demo link or GitHub repo
- [x] 200-word Gemini integration summary (see kaggle_writeup.md)

---

## Demo Script
See [demo_script.txt](./demo_script.txt) for a step-by-step 2-minute demo.

---

## License
MIT
