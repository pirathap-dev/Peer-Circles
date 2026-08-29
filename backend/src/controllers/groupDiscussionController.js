const groupDiscussionService = require('../services/groupDiscussionService');
const db = require('../config/db');

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
