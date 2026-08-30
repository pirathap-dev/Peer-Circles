// Data-access layer for users.
const db = require('../config/db');
const { hashPassword, comparePassword } = require('./passwordService');
const { signToken } = require('./tokenService');

async function createUser({ name, email, password }) {
  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rowCount > 0) {
    const error = new Error('EMAIL_TAKEN');
    error.code = 'EMAIL_TAKEN';
    throw error;
  }

  const hashed = await hashPassword(password);
  const result = await db.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at`,
    [name.trim(), email.toLowerCase(), hashed]
  );
  return result.rows[0];
}

async function authenticate({ email, password }) {
  const result = await db.query(
    'SELECT id, name, email, password FROM users WHERE email = $1',
    [email.toLowerCase()]
  );
  const user = result.rows[0];
  if (!user) {
    const error = new Error('INVALID_CREDENTIALS');
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const ok = await comparePassword(password, user.password);
  if (!ok) {
    const error = new Error('INVALID_CREDENTIALS');
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  return { id: user.id, name: user.name, email: user.email };
}

async function getUserById(id) {
  const result = await db.query(
    'SELECT id, name, email, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

function issueAuthToken(user) {
  return signToken({ id: user.id, email: user.email });
}

module.exports = { createUser, authenticate, getUserById, issueAuthToken };
