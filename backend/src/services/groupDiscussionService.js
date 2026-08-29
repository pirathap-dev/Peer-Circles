const db = require('../config/db');

// Get discussions/posts for a group
async function getGroupPosts(communityId) {
  const result = await db.query(
    `SELECT
       p.id,
       p.community_id,
       p.user_id,
       p.title,
       p.content,
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


// Create a new discussion post
async function createGroupPost({
  userId,
  communityId,
  title,
  content
}) {
  const result = await db.query(
    `INSERT INTO posts
      (community_id, user_id, title, content)
     VALUES ($1, $2, $3, $4)
     RETURNING
       id,
       community_id,
       user_id,
       title,
       content,
       created_at`,
    [
      communityId,
      userId,
      title,
      content
    ]
  );

  return result.rows[0];
}


module.exports = {
  getGroupPosts,
  createGroupPost
};