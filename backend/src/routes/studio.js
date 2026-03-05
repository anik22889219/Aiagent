const express = require('express');
const router = express.Router();
const studioController = require('../controllers/studioController');

// Define API routes for Creator Studio features
router.post('/linkedin', studioController.postToLinkedIn);
router.post('/image', studioController.generateImage);
router.post('/video', studioController.generateVideo);
router.post('/recharge', studioController.rechargeCredits);

module.exports = router;
