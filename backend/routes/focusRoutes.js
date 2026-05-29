/**
 * backend/routes/focusRoutes.js
 * ------------------------------------------------------------
 * Routes for focus sessions.
 */

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { saveFocusSession, getTotalFocusHours } = require('../controllers/focusController');

const router = express.Router();

router.post('/', authMiddleware.authMiddleware, saveFocusSession);
router.get('/total', authMiddleware.authMiddleware, getTotalFocusHours);

module.exports = router;

