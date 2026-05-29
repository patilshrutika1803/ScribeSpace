/**
 * backend/routes/moodRoutes.js
 * ------------------------------------------------------------
 * Routes for mood logs.
 */

const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { saveMood, getMoodHistory } = require('../controllers/moodController');

const router = express.Router();

router.post('/', authMiddleware.authMiddleware, saveMood);
router.get('/', authMiddleware.authMiddleware, getMoodHistory);

module.exports = router;

