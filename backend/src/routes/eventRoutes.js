const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authOptional, authAdminRequired } = require('../middleware/auth');

// Public or optional auth for viewing events
router.get('/', authOptional, eventController.listEvents);
router.get('/:id', authOptional, eventController.getEvent);

router.post('/', authAdminRequired, eventController.createEvent);
router.put('/:id', authAdminRequired, eventController.updateEvent);
router.delete('/:id', authAdminRequired, eventController.deleteEvent);

module.exports = router;
