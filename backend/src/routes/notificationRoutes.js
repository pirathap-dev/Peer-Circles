const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authRequired } = require('../middleware/auth');

// Require auth for accessing personal notifications
router.get('/', authRequired, notificationController.getNotifications);
router.put('/:id/read', authRequired, notificationController.markAsRead);

module.exports = router;
