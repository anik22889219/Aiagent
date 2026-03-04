const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user, secret, expiresIn) => {
  return jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn });
};

const logAuthEvent = (req, level, message) => {
  const SystemLog = require('../models/SystemLog');
  const log = new SystemLog({ level, message, userId: req.user ? req.user.id : null });
  log.save();
  const logNs = req.app.get('logNamespace');
  if (logNs) logNs.emit('log', log);
};

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(422).json({ message: 'Email and password are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists.' });
    }
    const user = new User({ email, password, role });
    await user.save();
    const accessToken = generateToken(user, process.env.JWT_SECRET, '15m');
    const refreshToken = generateToken(user, process.env.JWT_REFRESH_SECRET, '7d');
    res.status(201).json({ accessToken, refreshToken });
    logAuthEvent(req, 'info', `User registered: ${user.email}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    user.lastLogin = new Date();
    await user.save();
    const accessToken = generateToken(user, process.env.JWT_SECRET, '15m');
    const refreshToken = generateToken(user, process.env.JWT_REFRESH_SECRET, '7d');
    res.json({ accessToken, refreshToken });
    logAuthEvent(req, 'info', `User logged in: ${user.email}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Refresh token required' });
  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    const accessToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  });
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
