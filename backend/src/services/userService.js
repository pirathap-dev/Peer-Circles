// Data-access layer for users.
const db = require('../config/db');
const { hashPassword, comparePassword } = require('./passwordService');
const { signToken } = require('./tokenService');

// Create a new user in the database. Throws an error if the email is already taken.
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
     RETURNING id, name, email, avatar_url, created_at`,
    [name.trim(), email.toLowerCase(), hashed]
  );
  return result.rows[0];
}

async function authenticate({ email, password }) {
  const result = await db.query(
    'SELECT id, name, email, avatar_url, password FROM users WHERE email = $1',
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

  return { id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url || null };
}

async function getUserById(id) {
  const result = await db.query(
    'SELECT id, name, email, avatar_url, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

// Update name/email/avatar for an existing user. Throws EMAIL_TAKEN if the
// email is used by a different account.
async function updateUser(id, { name, email, avatar_url }) {
  const existing = await db.query(
    'SELECT id FROM users WHERE email = LOWER($1) AND id <> $2',
    [email.trim(), id]
  );
  if (existing.rowCount > 0) {
    const error = new Error('EMAIL_TAKEN');
    error.code = 'EMAIL_TAKEN';
    throw error;
  }

  const result = await db.query(
    `UPDATE users
     SET name = $2,
         email = LOWER($3),
         avatar_url = COALESCE($4, avatar_url),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, name, email, avatar_url, created_at`,
    [id, name.trim(), email.trim(), avatar_url || null]
  );
  return result.rows[0] || null;
}

function issueAuthToken(user) {
  return signToken({ id: user.id, email: user.email });
}

module.exports = { createUser, authenticate, getUserById, updateUser, issueAuthToken };
