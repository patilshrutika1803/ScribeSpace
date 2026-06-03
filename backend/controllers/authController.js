/**
 * backend/controllers/authController.js
 * ------------------------------------------------------------
 * Handles user registration and login.
 * - Register: hash password with bcryptjs and store user
 * - Login: validate password and issue JWT
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');


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

    // --- Email verification fields (Step 1) ---
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      name: String(name).trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'user',
      isVerified: false,
      verificationToken,
      verificationExpires,
    });

    // Send verification email
    const verificationUrl = `http://localhost:5173/verify-email/${verificationToken}`;

    const subject = 'Verify Your ScribeSpace Account';
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2 style="margin-bottom: 12px;">Welcome to ScribeSpace, ${user.name}!</h2>
        <p style="margin-bottom: 18px;">
          Please verify your email address to activate your account.
        </p>

        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 16px; background: #111827; color: #ffffff; text-decoration: none; border-radius: 6px;">
          Verify Account
        </a>

        <p style="margin-top: 18px; color: #374151;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <span style="word-break: break-all;">${verificationUrl}</span>
        </p>
      </div>
    `;

    await sendEmail(user.email, subject, html);

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

    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in'
      });
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

/**
 * GET /api/auth/verify/:token
 */
async function verifyEmail(req, res) {
  try {
    const token = req.params?.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    if (user.verificationExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Verification token expired'
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationExpires = null;

    await user.save();

    return res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Email verification failed',
      error: String(err?.message || err)
    });
  }
}

module.exports = { register, login, verifyEmail };


