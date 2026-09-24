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
       p.is_anonymous,
       p.anon_alias,
       p.created_at,
       CASE WHEN p.is_anonymous = TRUE THEN NULL ELSE u.name END AS author_name
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
  content,
  isAnonymous,
  anonAlias
}) {
  const result = await db.query(
    `INSERT INTO posts
      (community_id, user_id, title, content, is_anonymous, anon_alias)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING
       id,
       community_id,
       user_id,
       title,
       content,
       is_anonymous,
       anon_alias,
       created_at`,
    [
      communityId,
      userId,
      title,
      content,
      isAnonymous,
      anonAlias
    ]
  );

  const post = result.rows[0];
  let author_name = null;
  if (!isAnonymous) {
    const author = await db.query('SELECT name FROM users WHERE id = $1', [userId]);
    author_name = author.rows[0] ? author.rows[0].name : null;
  }

  return {
    ...post,
    author_name
  };
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
       p.is_anonymous,
       p.anon_alias,
       p.created_at,
       CASE WHEN p.is_anonymous = TRUE THEN NULL ELSE u.name END AS author_name
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
       c.is_anonymous,
       c.anon_alias,
       c.created_at,
       CASE WHEN c.is_anonymous = TRUE THEN NULL ELSE u.name END AS author_name
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
    [postId]
  );

  return result.rows;
}

// Create a comment on a post
async function createComment({ userId, postId, content, isAnonymous, anonAlias }) {
  const result = await db.query(
    `INSERT INTO comments
       (post_id, user_id, content, is_anonymous, anon_alias)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING
       id,
       post_id,
       user_id,
       content,
       is_anonymous,
       anon_alias,
       created_at`,
    [postId, userId, content.trim(), isAnonymous, anonAlias]
  );

  const comment = result.rows[0];

  let author_name = null;
  if (!isAnonymous) {
    const author = await db.query('SELECT name FROM users WHERE id = $1', [userId]);
    author_name = author.rows[0] ? author.rows[0].name : 'Anonymous';
  }

  return {
    ...comment,
    author_name
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