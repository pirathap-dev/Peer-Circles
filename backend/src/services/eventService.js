// Data-access layer for events.
const db = require('../config/db');

async function listEvents({ category, search, upcomingOnly } = {}) {
  let query = 'SELECT id, title, description, date, location, category, created_at FROM events';
  const where = [];
  const params = [];

  if (category) {
    params.push(category);
    where.push(`category = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    where.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`);
  }
  if (upcomingOnly === 'true' || upcomingOnly === true) {
    where.push(`date >= NOW()`);
  }

  if (where.length) query += ' WHERE ' + where.join(' AND ');
  query += ' ORDER BY date ASC';

  const result = await db.query(query, params);
  return result.rows;
}

async function getEventById(id) {
  const result = await db.query(
    'SELECT id, title, description, date, location, category, created_at FROM events WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function createEvent(data) {
  const { title, description, date, location, category } = data;
  const result = await db.query(
    'INSERT INTO events (title, description, date, location, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, description || null, date, location || null, category || null]
  );
  return result.rows[0];
}

async function updateEvent(id, data) {
  const { title, description, date, location, category } = data;
  const result = await db.query(
    'UPDATE events SET title = $1, description = $2, date = $3, location = $4, category = $5 WHERE id = $6 RETURNING *',
    [title, description || null, date, location || null, category || null, id]
  );
  return result.rows[0] || null;
}

async function deleteEvent(id) {
  const result = await db.query(
    'DELETE FROM events WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rowCount > 0;
}

module.exports = {
  listEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
