const express = require('express');
const router = express.Router();
const memoryController = require('../controllers/memoryController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.post('/', memoryController.createMemory);
router.get('/', memoryController.getMemories);
router.get('/search', memoryController.searchMemories);
router.get('/:id', memoryController.getMemoryById);
router.patch('/:id', memoryController.updateMemory);
router.delete('/:id', memoryController.deleteMemory);

module.exports = router;
