const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS for localhost only
app.use(cors({
  origin: [/^http:\/\/localhost(:\d+)?$/],
  credentials: true
}));

app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.LOG_LEVEL === 'debug' ? 'dev' : 'tiny'));

// Ensure outputs and sample_data exist
['outputs', 'sample_data'].forEach(dir => {
  const full = path.join(__dirname, dir);
  if (!fs.existsSync(full)) fs.mkdirSync(full);
});

// Static serving for outputs
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

// API routes
app.use('/api/generate', require('./routes/generate'));
app.use('/api/edit', require('./routes/edit'));
app.use('/api/narrate', require('./routes/narrate'));
app.use('/api/compose', require('./routes/compose'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`HistoryLens backend running on port ${PORT}`);
});
