const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { authOptional, authAdminRequired } = require('../middleware/auth');

// Public or optional auth for viewing resources
router.get('/', authOptional, resourceController.listResources);
router.get('/:id', authOptional, resourceController.getResource);

router.post('/', authAdminRequired, resourceController.createResource);
router.put('/:id', authAdminRequired, resourceController.updateResource);
router.delete('/:id', authAdminRequired, resourceController.deleteResource);

module.exports = router;
