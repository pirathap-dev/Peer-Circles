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

// Get a single post (with author) within a specific group
async function getGroupPost(communityId, postId) {
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
     WHERE p.id = $1
       AND p.community_id = $2`,
    [postId, communityId]
  );

  return result.rows[0] || null;
}

// Get all comments for a post (with author names)
async function getComments(postId) {
  const result = await db.query(
    `SELECT
       c.id,
       c.post_id,
       c.user_id,
       c.content,
       c.created_at,
       u.name AS author_name
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
    [postId]
  );

  return result.rows;
}

// Create a comment on a post
async function createComment({ userId, postId, content }) {
  const result = await db.query(
    `INSERT INTO comments
       (post_id, user_id, content)
     VALUES ($1, $2, $3)
     RETURNING
       id,
       post_id,
       user_id,
       content,
       created_at`,
    [postId, userId, content.trim()]
  );

  const comment = result.rows[0];

  // Attach the author name so the client can render it directly.
  const author = await db.query(
    'SELECT name FROM users WHERE id = $1',
    [userId]
  );

  return {
    ...comment,
    author_name: author.rows[0] ? author.rows[0].name : 'Anonymous'
  };
}

// Delete a comment (only the author can delete their own comment)
async function deleteComment(userId, commentId) {
  const result = await db.query(
    `DELETE FROM comments
     WHERE id = $1
       AND user_id = $2
     RETURNING id`,
    [commentId, userId]
  );

  if (result.rowCount === 0) {
    const error = new Error('COMMENT_NOT_FOUND');
    error.code = 'COMMENT_NOT_FOUND';
    throw error;
  }

  return true;
}


module.exports = {
  getGroupPosts,
  createGroupPost,
  getGroupPost,
  getComments,
  createComment,
  deleteComment
};