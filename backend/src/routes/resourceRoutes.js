const express = require('express');
const resourceController = require('../controllers/resourceController');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.get('/', authRequired, resourceController.listResources);
router.get('/:id', authRequired, resourceController.getResource);

module.exports = router;