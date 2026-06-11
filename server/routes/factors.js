const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getFactors } = require('../controllers/factorsController');

router.get('/', auth, getFactors);

module.exports = router;
