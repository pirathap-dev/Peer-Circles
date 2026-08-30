const express = require('express');

const router = express.Router();

const groupDiscussionController = require(
  '../controllers/groupDiscussionController'
);

const { authRequired } = require('../middleware/auth');

router.get(
  '/groups/:id/posts',
  authRequired,
  groupDiscussionController.getGroupPosts
);
router.post(
  '/groups/:id/posts',
  authRequired,
  groupDiscussionController.createGroupPost
);
router.get(
  '/groups/:id/posts/:postId',
  authRequired,
  groupDiscussionController.getGroupPost
);
router.post(
  '/groups/:postId/comments',
  authRequired,
  groupDiscussionController.createComment
);
router.delete(
  '/groups/:postId/comments/:commentId',
  authRequired,
  groupDiscussionController.deleteComment
);

module.exports = router;