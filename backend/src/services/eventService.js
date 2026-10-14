// Data-access layer for events.
const db = require('../config/db');
const notificationService = require('./notificationService');

async function listEvents({ category, search, upcomingOnly } = {}) {
  let query = 'SELECT id, title, description, date, location, latitude, longitude, category, created_at FROM events';
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
    'SELECT id, title, description, date, location, latitude, longitude, category, created_at FROM events WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function createEvent(data) {
  const { title, description, date, location, latitude, longitude, category } = data;
  return db.transaction(async (client) => {
    const result = await client.query(
      `INSERT INTO events (title, description, date, location, latitude, longitude, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description || null, date, location || null, latitude ?? null, longitude ?? null, category || null]
    );
    await notificationService.createBroadcastNotification(
      client,
      'event',
      `A new event was posted: ${title}`
    );
    return result.rows[0];
  });
}

async function updateEvent(id, data) {
  const { title, description, date, location, latitude, longitude, category } = data;
  const result = await db.query(
    `UPDATE events
     SET title = $1, description = $2, date = $3, location = $4,
         latitude = $5, longitude = $6, category = $7
     WHERE id = $8 RETURNING *`,
    [title, description || null, date, location || null, latitude ?? null, longitude ?? null, category || null, id]
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
