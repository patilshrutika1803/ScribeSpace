/**
 * backend/controllers/focusController.js
 * ------------------------------------------------------------
 * Focus session features for the logged-in user.
 */

const FocusSession = require('../models/FocusSession');

/**
 * POST /api/focus
 * Body: { mode, durationMinutes, completed }
 */
async function saveFocusSession(req, res) {
  try {
    const { mode, durationMinutes, completed } = req.body || {};

    if (!mode || durationMinutes === undefined || durationMinutes === null) {
      return res.status(400).json({ message: 'mode and durationMinutes are required' });
    }

    const duration = Number(durationMinutes);
    if (Number.isNaN(duration) || duration < 0) {
      return res.status(400).json({ message: 'durationMinutes must be a non-negative number' });
    }

    const session = await FocusSession.create({
      user: req.user.id,
      mode,
      durationMinutes: duration,
      completed: completed === undefined ? true : Boolean(completed),
    });

    return res.status(201).json({ message: 'Focus session saved', session });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to save focus session', error: String(err?.message || err) });
  }
}

/**
 * GET /api/focus/total
 * Returns total focus hours for the logged-in user.
 */
async function getTotalFocusHours(req, res) {
  try {
    const sessions = await FocusSession.find({ user: req.user.id, completed: true });

    const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

    return res.json({
      totalMinutes,
      totalHours: Number((totalMinutes / 60).toFixed(2)),
      sessionsCount: sessions.length,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to compute total focus hours', error: String(err?.message || err) });
  }
}

module.exports = { saveFocusSession, getTotalFocusHours };

