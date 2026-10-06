const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authRequired } = require('../middleware/auth');

// Require auth for accessing personal notifications
router.get('/', authRequired, notificationController.getNotifications);
router.put('/:id/read', authRequired, notificationController.markAsRead);

// Normally creating a notification happens internally by other services (e.g. messaging),
// but we provide an endpoint if needed (perhaps limited to admins in a real app)
router.post('/', authRequired, notificationController.createNotification);

module.exports = router;
