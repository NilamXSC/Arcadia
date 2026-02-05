const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'arcadia-dev-secret-change-in-production';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const token = authHeader.split(' ')[1];
    
    // Check if it's a guest token (base64 encoded JSON)
    try {
      const guestData = JSON.parse(Buffer.from(token, 'base64').toString());
      if (guestData.role === 'guest') {
        req.user = guestData;
        return next();
      }
    } catch {
      // Not a guest token, continue with JWT verification
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    next(err);
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    const token = authHeader.split(' ')[1];
    
    // Check if it's a guest token
    try {
      const guestData = JSON.parse(Buffer.from(token, 'base64').toString());
      if (guestData.role === 'guest') {
        req.user = guestData;
        return next();
      }
    } catch {
      // Not a guest token, continue
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (user) req.user = user;
    next();
  } catch {
    next();
  }
};

module.exports = { auth, optionalAuth, JWT_SECRET };
