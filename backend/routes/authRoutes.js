/**
 * backend/routes/authRoutes.js
 * ------------------------------------------------------------
 * Routes for authentication.
 */

const express = require('express');
const { register, login, verifyEmail } = require('../controllers/authController');


const router = express.Router();

// Register new user
router.post('/register', register);

// Login existing user
router.post('/login', login);

// Verify email
router.get('/verify/:token', verifyEmail);

module.exports = router;


