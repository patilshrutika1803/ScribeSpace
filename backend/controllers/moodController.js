/**
 * backend/controllers/moodController.js
 * ------------------------------------------------------------
 * Mood logging features for the logged-in user.
 */

const Mood = require('../models/Mood');

/**
 * POST /api/mood
 * Body: { mood, note }
 */
async function saveMood(req, res) {
  try {
    const { mood, note } = req.body || {};

    if (!mood) {
      return res.status(400).json({ message: 'mood is required' });
    }

    const log = await Mood.create({
      user: req.user.id,
      mood,
      note,
    });

    return res.status(201).json({ message: 'Mood saved', log });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to save mood', error: String(err?.message || err) });
  }
}

/**
 * GET /api/mood
 * Returns mood history for the logged-in user.
 */
async function getMoodHistory(req, res) {
  try {
    const logs = await Mood.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json({ logs });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch mood history', error: String(err?.message || err) });
  }
}

module.exports = { saveMood, getMoodHistory };

