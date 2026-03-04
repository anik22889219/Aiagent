const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/refresh', authLimiter, authController.refreshToken);
router.get('/me', verifyToken, authController.me);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
	// req.user created by passport strategy
	const user = req.user;
	const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
	const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
	// Redirect to frontend with token in hash (frontend should parse it)
	return res.redirect(`${frontend}/auth/success#token=${token}`);
});

module.exports = router;
