const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getWeeklyStats, getMonthlyStats } = require('../controllers/statsController');

router.get('/weekly', auth, getWeeklyStats);
router.get('/monthly', auth, getMonthlyStats);

module.exports = router;
