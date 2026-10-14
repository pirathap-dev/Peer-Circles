// JWT authentication middleware.
const { verifyToken } = require('../services/tokenService');
const db = require('../config/db');

async function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }
  if (payload.role === 'admin') {
    return res.status(403).json({ error: 'A user account is required for this action.' });
  }

  try {
    const result = await db.query('SELECT id FROM users WHERE id = $1', [payload.id]);
    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Account not found. Please sign in again.' });
    }

    req.user = { id: result.rows[0].id, email: payload.email };
    return next();
  } catch (err) {
    console.error('Authentication user lookup error:', err);
    return res.status(500).json({ error: 'Could not verify account.' });
  }
}

function authAdminRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Admin authentication required.' });
  }

  try {
    const payload = verifyToken(token);
    if (payload.role !== 'admin' || !payload.username) {
      return res.status(403).json({ error: 'Administrator access required.' });
    }
    req.admin = { username: payload.username };
    return next();
  } catch (_err) {
    return res.status(401).json({ error: 'Admin session expired. Please sign in again.' });
  }
}

// Optional auth: attaches req.user if a valid token is present, otherwise continues.
function authOptional(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next();

  try {
    const payload = verifyToken(token);
    if (payload.role !== 'admin') {
      req.user = { id: payload.id, email: payload.email };
    }
  } catch (_err) {
    // Invalid token is ignored for optional routes.
  }
  next();
}

module.exports = { authRequired, authAdminRequired, authOptional };
