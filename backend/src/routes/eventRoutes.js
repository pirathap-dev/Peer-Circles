const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authRequired, authOptional } = require('../middleware/auth');

// Public or optional auth for viewing events
router.get('/', authOptional, eventController.listEvents);
router.get('/:id', authOptional, eventController.getEvent);

// Require auth for managing events
// Depending on requirements, we might want only admins to do this. For now, we use authRequired.
router.post('/', authRequired, eventController.createEvent);
router.put('/:id', authRequired, eventController.updateEvent);
router.delete('/:id', authRequired, eventController.deleteEvent);

module.exports = router;
