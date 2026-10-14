const express = require('express');

const router = express.Router();

const groupController = require('../controllers/groupController');

const { authRequired, authAdminRequired } = require('../middleware/auth');

// Only administrators can create peer groups.
router.post('/', authAdminRequired, groupController.createGroup);
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