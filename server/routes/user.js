const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { updateGoal, getMe } = require('../controllers/userController');

router.get('/me', auth, getMe);
router.put('/goal', auth, updateGoal);

module.exports = router;
