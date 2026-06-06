/**
 * backend/routes/journalRoutes.js
 * Routes for journal entries.
 */

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const {
  createJournalEntry,
  getMyJournalEntries,
  deleteJournalEntry,
  updateJournalEntry,
} = require('../controllers/journalController');

const router = express.Router();

// Create journal entry
router.post(
  '/',
  authMiddleware.authMiddleware,
  createJournalEntry
);

// Get all journal entries
router.get(
  '/',
  authMiddleware.authMiddleware,
  getMyJournalEntries
);

// Update journal entry
router.put(
  '/:id',
  authMiddleware.authMiddleware,
  updateJournalEntry
);

// Delete journal entry
router.delete(
  '/:id',
  authMiddleware.authMiddleware,
  deleteJournalEntry
);

module.exports = router;