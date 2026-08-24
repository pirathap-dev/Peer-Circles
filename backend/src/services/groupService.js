const db = require('../config/db');

async function getAllGroups() {
  const result = await db.query(
    `SELECT
       id,
       name,
       description,
       location,
       member_count,
       created_at
     FROM communities
     ORDER BY created_at DESC`
  );

  return result.rows;
}

async function getGroupById(id) {
  const result = await db.query(
    `SELECT
       id,
       name,
       description,
       location,
       member_count,
       created_at
     FROM communities
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  getAllGroups,
  getGroupById
};