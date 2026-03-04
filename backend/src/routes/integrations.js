const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integrationController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/tools', integrationController.listTools);
router.patch('/tools/:id', integrationController.toggleTool);
// webhook endpoint
router.post('/n8n/trigger', integrationController.n8nTrigger);

module.exports = router;