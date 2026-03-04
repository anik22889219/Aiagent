const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/knowledgeController');

router.post('/train', ctrl.train);
router.post('/query', ctrl.query);
router.get('/', ctrl.listKnowledge);
router.get('/topics', ctrl.getTopics);
router.get('/sessions', ctrl.getSessions);
router.post('/correct', ctrl.correct);
router.delete('/:id', ctrl.deleteKnowledge);

module.exports = router;
