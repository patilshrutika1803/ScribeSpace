/**
 * backend/routes/journalRoutes.js
 * ------------------------------------------------------------
 * Routes for journal entries.
 */

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createJournalEntry,
  getMyJournalEntries,
  deleteJournalEntry,
} = require('../controllers/journalController');

const router = express.Router();

router.post('/', authMiddleware.authMiddleware, createJournalEntry);
router.get('/', authMiddleware.authMiddleware, getMyJournalEntries);
router.delete('/:id', authMiddleware.authMiddleware, deleteJournalEntry);

module.exports = router;

