const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/messageController');
const { authRequired } = require('../middleware/auth');

// All routes require authentication
router.get(   '/conversations',         authRequired, ctrl.getConversations);
router.post(  '/conversations',         authRequired, ctrl.startConversation);
router.get(   '/:conversationId',       authRequired, ctrl.getMessages);
router.post(  '/',                      authRequired, ctrl.sendMessage);
router.delete('/:messageId',            authRequired, ctrl.deleteMessage);

module.exports = router;
