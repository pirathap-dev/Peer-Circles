// Data-access layer for educational resources.
const db = require('../config/db');

async function listResources({ category, search } = {}) {
  let query = 'SELECT id, title, description, content, category, url, created_at FROM educational_resources';
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

  if (where.length) query += ' WHERE ' + where.join(' AND ');
  query += ' ORDER BY created_at DESC';

  const result = await db.query(query, params);
  return result.rows;
}

async function getResourceById(id) {
  const result = await db.query(
    'SELECT id, title, description, content, category, url, created_at FROM educational_resources WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function createResource(data) {
  const { title, description, content, category, url } = data;
  const result = await db.query(
    'INSERT INTO educational_resources (title, description, content, category, url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [title, description || null, content || null, category || null, url || null]
  );
  return result.rows[0];
}

async function updateResource(id, data) {
  const { title, description, content, category, url } = data;
  const result = await db.query(
    'UPDATE educational_resources SET title = $1, description = $2, content = $3, category = $4, url = $5 WHERE id = $6 RETURNING *',
    [title, description || null, content || null, category || null, url || null, id]
  );
  return result.rows[0] || null;
}

async function deleteResource(id) {
  const result = await db.query(
    'DELETE FROM educational_resources WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rowCount > 0;
}

module.exports = {
  listResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
};
