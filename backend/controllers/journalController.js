/**
 * backend/controllers/journalController.js
 * ------------------------------------------------------------
 * Journal CRUD operations for the logged-in user.
 */

const Journal = require('../models/Journal');

/**
 * POST /api/journal
 * Body: { title, mood, content }
 */
async function createJournalEntry(req, res) {
  try {
    const { title, mood, content } = req.body || {};

    if (!title || !content) {
      return res.status(400).json({ message: 'title and content are required' });
    }

    const entry = await Journal.create({
      user: req.user.id,
      title,
      mood,
      content,
    });

    return res.status(201).json({ message: 'Journal entry created', entry });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create journal entry', error: String(err?.message || err) });
  }
}

/**
 * GET /api/journal
 * Returns all journal entries for the logged-in user.
 */
async function getMyJournalEntries(req, res) {
  try {
    const { search, mood } = req.query || {};

    const query = { user: req.user.id };

    if (mood && typeof mood === 'string' && mood.trim()) {
      query.mood = mood.trim();
    }

    if (search && typeof search === 'string' && search.trim()) {
      const term = search.trim();

      // Escape regex special chars to prevent regex injection
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      query.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { content: { $regex: escaped, $options: 'i' } },
      ];
    }

    const entries = await Journal.find(query).sort({ createdAt: -1 });
    return res.json({ entries });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch journal entries', error: String(err?.message || err) });
  }
}

/**
 * DELETE /api/journal/:id
 * Deletes a journal entry owned by the logged-in user.
 */
async function deleteJournalEntry(req, res) {
  try {
    const { id } = req.params;

    const deleted = await Journal.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    return res.json({ message: 'Journal entry deleted', id });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete journal entry', error: String(err?.message || err) });
  }
}

/**
 * PUT /api/journal/:id
 * Updates a journal entry owned by the logged-in user.
 * Body: { title, mood, content }
 */
async function updateJournalEntry(req, res) {
  try {
    const { id } = req.params;
    const { title, mood, content } = req.body || {};

    if (!title || !content) {
      return res.status(400).json({ message: 'title and content are required' });
    }

    const updated = await Journal.findOneAndUpdate(
      { _id: id, user: req.user.id },
      {
        $set: {
          title,
          mood,
          content,
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    return res.json({ message: 'Journal entry updated', entry: updated });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to update journal entry',
      error: String(err?.message || err),
    });
  }
}

module.exports = {
  createJournalEntry,
  getMyJournalEntries,
  deleteJournalEntry,
  updateJournalEntry,
};

