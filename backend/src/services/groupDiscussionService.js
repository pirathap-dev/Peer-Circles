const db = require('../config/db');

// Get discussions/posts for a group
async function getGroupPosts(communityId) {
  const result = await db.query(
    `SELECT
       p.id,
       p.title,
       p.content,
       p.user_id,
       p.community_id,
       p.created_at,
       u.name AS author_name
     FROM posts p
     JOIN users u ON u.id = p.user_id
     WHERE p.community_id = $1
     ORDER BY p.created_at DESC`,
    [communityId]
  );

  return result.rows;
}

module.exports = {
  getGroupPosts
};