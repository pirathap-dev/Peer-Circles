const express = require('express');

const router = express.Router();

const groupController = require('../controllers/groupController');

const { authRequired } = require('../middleware/auth');

// Browse groups
router.get('/', authRequired, groupController.getGroups);

// View one group
router.get('/:id', authRequired, groupController.getGroup);

// Join group
router.post('/:id/join', authRequired, groupController.joinGroup);

// Leave group
router.delete('/:id/leave', authRequired, groupController.leaveGroup);

// Check membership
router.get(
  '/:id/membership',
  authRequired,
  groupController.checkMembership
);

module.exports = router;