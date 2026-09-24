const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { authRequired, authOptional } = require('../middleware/auth');

router.get('/', authOptional, communityController.listCommunities);
router.get('/:id', authOptional, communityController.getCommunity);
router.post('/:id/join', authRequired, communityController.joinCommunity);
router.delete('/:id/leave', authRequired, communityController.leaveCommunity);
router.patch('/:id/anonymous', authRequired, communityController.setMembershipAnonymous);

module.exports = router;
