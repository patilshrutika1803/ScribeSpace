/**
 * backend/middleware/authMiddleware.js
 * ------------------------------------------------------------
 * JWT authentication middleware.
 */

const jwt = require('jsonwebtoken');

/**
 * authMiddleware
 * ------------------------------------------------------------
 * Expects header: Authorization: Bearer <token>
 * Attaches decoded user info onto req.user.
 */
function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    const token = header.slice('Bearer '.length);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({ message: 'JWT_SECRET is not configured' });
    }

    const decoded = jwt.verify(token, secret);

    // decoded should include userId and role
    req.user = {
      id: decoded.userId,
      role: decoded.role,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { authMiddleware };

