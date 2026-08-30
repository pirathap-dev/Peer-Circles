const groupDiscussionService = require('../services/groupDiscussionService');
const db = require('../config/db');

// Get posts for a specific group
exports.getGroupPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const communityId = Number(req.params.id);

    // Validate group ID
    if (!Number.isInteger(communityId)) {
      return res.status(400).json({
        error: 'Invalid group ID.'
      });
    }

    // Check group exists
    const groupResult = await db.query(
      `SELECT id, name
       FROM communities
       WHERE id = $1`,
      [communityId]
    );

    if (groupResult.rowCount === 0) {
      return res.status(404).json({
        error: 'Support group not found.'
      });
    }

    // Check user is a member
    const memberResult = await db.query(
      `SELECT id
       FROM community_members
       WHERE user_id = $1
         AND community_id = $2`,
      [userId, communityId]
    );

    if (memberResult.rowCount === 0) {
      return res.status(403).json({
        error: 'You must join this group to view discussions.'
      });
    }

    // Get posts
    const posts = await groupDiscussionService.getGroupPosts(
      communityId
    );

    return res.json({
      group: {
        id: groupResult.rows[0].id,
        name: groupResult.rows[0].name
      },
      posts
    });

  } catch (err) {
    console.error('Get group posts error:', err);

    return res.status(500).json({
      error: 'Could not load group discussions.'
    });
  }
};

exports.createGroupPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const communityId = Number(req.params.id);
    const { title, content } = req.body;

    if (!Number.isInteger(communityId)) {
      return res.status(400).json({ error: 'Invalid group ID.' });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Discussion title is required.' });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({
        error: 'Discussion title cannot exceed 200 characters.'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Discussion content is required.' });
    }

    if (content.trim().length > 2000) {
      return res.status(400).json({
        error: 'Discussion content cannot exceed 2000 characters.'
      });
    }

    const groupResult = await db.query(
      `SELECT id, name FROM communities WHERE id = $1`,
      [communityId]
    );

    if (groupResult.rowCount === 0) {
      return res.status(404).json({ error: 'Support group not found.' });
    }

    const memberResult = await db.query(
      `SELECT id
       FROM community_members
       WHERE user_id = $1 AND community_id = $2`,
      [userId, communityId]
    );

    if (memberResult.rowCount === 0) {
      return res.status(403).json({
        error: 'You must join this group to create a discussion.'
      });
    }

    const post = await groupDiscussionService.createGroupPost({
      userId,
      communityId,
      title: title.trim(),
      content: content.trim()
    });

    return res.status(201).json({
      message: 'Discussion created successfully.',
      post
    });
  } catch (err) {
    console.error('Create group post error:', err);
    return res.status(500).json({ error: 'Could not create discussion.' });
  }
};

// GET /groups/:id/posts/:postId
exports.getGroupPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const communityId = Number(req.params.id);
    const postId = Number(req.params.postId);

    if (!Number.isInteger(communityId) || !Number.isInteger(postId)) {
      return res.status(400).json({ error: 'Invalid group or discussion ID.' });
    }

    // Check the post exists within this group.
    const post = await groupDiscussionService.getGroupPost(communityId, postId);
    if (!post) {
      return res.status(404).json({ error: 'Discussion not found.' });
    }

    // Check the user is a member of the group.
    const memberResult = await db.query(
      `SELECT id
       FROM community_members
       WHERE user_id = $1 AND community_id = $2`,
      [userId, communityId]
    );
    if (memberResult.rowCount === 0) {
      return res.status(403).json({
        error: 'You must join this group to view discussions.'
      });
    }

    const comments = await groupDiscussionService.getComments(postId);

    return res.json({ discussion: post, comments });
  } catch (err) {
    console.error('Get group post error:', err);
    return res.status(500).json({ error: 'Could not load discussion.' });
  }
};

// POST /groups/:postId/comments
exports.createComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = Number(req.params.postId);
    const { content } = req.body;

    if (!Number.isInteger(postId)) {
      return res.status(400).json({ error: 'Invalid discussion ID.' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content is required.' });
    }

    if (content.trim().length > 1000) {
      return res.status(400).json({ error: 'Comment cannot exceed 1000 characters.' });
    }

    // Ensure the post exists and get its community id.
    const postResult = await db.query(
      `SELECT id, community_id
       FROM posts
       WHERE id = $1`,
      [postId]
    );
    if (postResult.rowCount === 0) {
      return res.status(404).json({ error: 'Discussion not found.' });
    }
    const communityId = postResult.rows[0].community_id;

    // Check the user is a member of the group.
    const memberResult = await db.query(
      `SELECT id
       FROM community_members
       WHERE user_id = $1 AND community_id = $2`,
      [userId, communityId]
    );
    if (memberResult.rowCount === 0) {
      return res.status(403).json({
        error: 'You must join this group to comment on discussions.'
      });
    }

    const comment = await groupDiscussionService.createComment({
      userId,
      postId,
      content
    });

    return res.status(201).json({ comment });
  } catch (err) {
    console.error('Create comment error:', err);
    return res.status(500).json({ error: 'Could not post comment.' });
  }
};

// DELETE /groups/:postId/comments/:commentId
exports.deleteComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = Number(req.params.commentId);

    if (!Number.isInteger(commentId)) {
      return res.status(400).json({ error: 'Invalid comment ID.' });
    }

    await groupDiscussionService.deleteComment(userId, commentId);

    return res.json({ message: 'Comment deleted.' });
  } catch (err) {
    if (err.code === 'COMMENT_NOT_FOUND') {
      return res.status(404).json({ error: 'Comment not found.' });
    }
    console.error('Delete comment error:', err);
    return res.status(500).json({ error: 'Could not delete comment.' });
  }
};
