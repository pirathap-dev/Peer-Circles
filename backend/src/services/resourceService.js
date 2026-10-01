const db = require('../config/db');

async function listResources() {
  const result = await db.query(
    `SELECT id, title, description, category, content, url, created_at
     FROM educational_resources
     ORDER BY created_at DESC, id DESC`
  );
  return result.rows;
}

async function getResourceById(id) {
  const result = await db.query(
    `SELECT id, title, description, category, content, url, created_at
     FROM educational_resources
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

module.exports = { listResources, getResourceById };