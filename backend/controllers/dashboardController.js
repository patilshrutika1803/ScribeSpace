/**
 * backend/controllers/dashboardController.js
 * ------------------------------------------------------------
 * Dashboard statistics for the logged-in user.
 */

const Journal = require('../models/Journal');
const Mood = require('../models/Mood');
const FocusSession = require('../models/FocusSession');

/**
 * GET /api/dashboard/stats
 * Returns aggregated stats for the logged-in user.
 */
async function getDashboardStats(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [journalCount, moodLogs, focusSessionsAgg] = await Promise.all([
      Journal.countDocuments({ user: userId }),
      Mood.find({ user: userId }).select('mood -_id'),
      FocusSession.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalFocusSessions: { $sum: 1 },
            totalFocusMinutes: { $sum: '$durationMinutes' },
          },
        },
      ]),
    ]);

    const totalMoodLogs = moodLogs?.length || 0;

    let mostCommonMood = '—';
    if (totalMoodLogs > 0) {
      const counts = moodLogs.reduce((acc, doc) => {
        const m = doc?.mood;
        if (!m) return acc;
        acc[m] = (acc[m] || 0) + 1;
        return acc;
      }, {});

      let best = null;
      for (const [mood, count] of Object.entries(counts)) {
        if (!best || count > best.count) {
          best = { mood, count };
        }
      }

      if (best?.mood) mostCommonMood = best.mood;
    }

    const focusAgg = focusSessionsAgg?.[0] || {};

    return res.json({
      totalJournalEntries: journalCount,
      totalMoodLogs,
      totalFocusSessions: focusAgg.totalFocusSessions || 0,
      totalFocusMinutes: focusAgg.totalFocusMinutes || 0,
      mostCommonMood,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch dashboard stats',
      error: String(err?.message || err),
    });
  }
}

module.exports = {
  getDashboardStats,
};

