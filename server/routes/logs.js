const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getLogs, createLog, deleteLog } = require('../controllers/logsController');

router.get('/', auth, getLogs);
router.post('/', auth, createLog);
router.delete('/:id', auth, deleteLog);

module.exports = router;
