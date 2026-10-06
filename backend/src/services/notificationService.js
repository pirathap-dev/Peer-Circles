// Data-access layer for notifications.
const db = require('../config/db');

async function getUserNotifications(userId) {
  const result = await db.query(
    'SELECT id, user_id, type, message, is_read, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

async function markAsRead(id, userId) {
  const result = await db.query(
    'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, userId]
  );
  return result.rows[0] || null;
}

async function createNotification(userId, type, message) {
  const result = await db.query(
    'INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3) RETURNING *',
    [userId, type, message]
  );
  return result.rows[0];
}

module.exports = {
  getUserNotifications,
  markAsRead,
  createNotification,
};
