const express = require('express');

const router = express.Router();

const groupController = require('../controllers/groupController');
const { authRequired } = require('../middleware/auth');

router.get('/', authRequired, groupController.getGroups);
//one by one

router.get('/:id', authRequired, groupController.getGroupById);

module.exports = router;