/**
 * backend/server.js
 * ------------------------------------------------------------
 * App entrypoint.
 * - Loads environment variables
 * - Connects to MongoDB
 * - Configures Express middleware
 * - Mounts REST API routes
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journalRoutes');
const moodRoutes = require('./routes/moodRoutes');
const focusRoutes = require('./routes/focusRoutes');

dotenv.config();

const app = express();

// Global middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/focus', focusRoutes);

// Start server after DB connection
const PORT = process.env.PORT || 5000;

// If MONGODB_URI is not provided yet (as requested), allow server startup
// so you can run the API routes and configure env later.
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[server] Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    if (String(err?.message || err).includes('MONGODB_URI is not defined')) {
      console.warn('[server] MongoDB not configured yet (MONGODB_URI missing). Starting server without DB connection.');
      app.listen(PORT, () => {
        console.log(`[server] Listening on port ${PORT} (no DB connection)`);
      });
      return;
    }

    console.error('[server] Failed to start due to DB connection error:', err);
    process.exit(1);
  });


