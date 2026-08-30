const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authRequired } = require('../middleware/auth');

// Auth routes: register, login, me.
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authRequired, authController.me);

module.exports = router;
