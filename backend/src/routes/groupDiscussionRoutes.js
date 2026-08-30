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

module.exports = router;