// JWT authentication middleware.
const { verifyToken } = require('../services/tokenService');

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }
}

// Optional auth: attaches req.user if a valid token is present, otherwise continues.
function authOptional(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next();

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id, email: payload.email };
  } catch (_err) {
    // Invalid token is ignored for optional routes.
  }
  next();
}

module.exports = { authRequired, authOptional };
