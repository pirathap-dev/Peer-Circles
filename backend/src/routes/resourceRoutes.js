const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { authRequired, authOptional } = require('../middleware/auth');

// Public or optional auth for viewing resources
router.get('/', authOptional, resourceController.listResources);
router.get('/:id', authOptional, resourceController.getResource);

// Require auth for managing resources
// Depending on requirements, we might want only admins to do this. For now, we use authRequired.
router.post('/', authRequired, resourceController.createResource);
router.put('/:id', authRequired, resourceController.updateResource);
router.delete('/:id', authRequired, resourceController.deleteResource);

module.exports = router;
