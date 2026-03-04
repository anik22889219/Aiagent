const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

router.post('/:id/pause', taskController.pauseTask);
router.post('/:id/resume', taskController.resumeTask);
router.post('/:id/cancel', taskController.cancelTask);

module.exports = router;
