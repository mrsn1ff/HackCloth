const jwt = require('jsonwebtoken');

// ✅ Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('⚠️ No token provided in request');
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  console.log('🔍 Received Token:', token); // Debugging Log

  if (!token || token === 'undefined') {
    console.warn('⚠️ Invalid token format received');
    return res.status(401).json({ message: 'Invalid token format' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is missing in environment variables');
    return res.status(500).json({ message: 'Internal server error' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token Decoded:', decoded); // Log decoded payload

    req.adminId = decoded.id; // Set admin ID
    req.adminEmail = decoded.email; // Save email for main admin check
    req.adminRole = decoded.role; // Save role if needed later

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.error('❌ Token has expired:', error.message);
      return res
        .status(403)
        .json({ message: 'Token expired. Please log in again.' });
    } else {
      console.error('❌ Token verification failed:', error.message);
      return res.status(403).json({ message: 'Invalid token' });
    }
  }
};

// ✅ Middleware to allow only the main admin to proceed
const isMainAdmin = (req, res, next) => {
  if (req.adminEmail === process.env.MAIN_ADMIN_EMAIL) {
    return next();
  } else {
    console.warn(`🚫 Access denied. Not main admin: ${req.adminEmail}`);
    return res
      .status(403)
      .json({ message: 'Only the main admin can perform this action.' });
  }
};

module.exports = { verifyToken, isMainAdmin };
