const express = require('express');

const router = express.Router();

const uploadController = require('../controllers/uploadController');

const { authRequired } = require('../middleware/auth');

// Upload an asset to Cloudinary (authenticated).
router.post('/', authRequired, uploadController.upload);

module.exports = router;