/**
 * backend/controllers/authController.js
 * ------------------------------------------------------------
 * Handles user registration and login.
 * - Register: hash password with bcryptjs and store user
 * - Login: validate password and issue JWT
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

/**
  * POST /api/auth/register
  * Body: { name, email, password }

 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    if (String(name).trim().length < 2) {
      return res.status(400).json({ message: 'name must be at least 2 characters' });
    }


    if (password.length < 6) {
      return res.status(400).json({ message: 'password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: String(name).trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'user',
    });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET is not configured' });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      secret,
      { expiresIn: '7d' },
    );

    return res.status(201).json({
      message: 'user registered successfully',
      token,
      role: user.role,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: String(err?.message || err) });
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
async function login(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET is not configured' });
    }

    // Keep payload minimal.
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
      },
      secret,
      { expiresIn: '7d' },
    );

    return res.json({
      message: 'login successful',
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: String(err?.message || err) });
  }
}

module.exports = { register, login };

