const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/status', systemController.getStatus);
router.get('/health', systemController.getHealth);
router.get('/logs', systemController.getLogs);

module.exports = router;
