const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/tasks-per-day', analyticsController.tasksPerDay);
router.get('/error-frequency', analyticsController.errorFrequency);
router.get('/execution-times', analyticsController.executionTimes);

module.exports = router;