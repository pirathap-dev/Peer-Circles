const express = require('express');
const router = express.Router();
const controller = require('../controllers/friendController');
const { authRequired } = require('../middleware/auth');

router.use(authRequired);
router.get('/', controller.getRelationships);
router.get('/search', controller.searchUsers);
router.post('/requests', controller.sendRequest);
router.patch('/requests/:requestId', controller.respondToRequest);
router.delete('/requests/:requestId', controller.cancelRequest);
router.delete('/:friendId', controller.removeFriend);

module.exports = router;
