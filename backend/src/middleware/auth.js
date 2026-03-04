const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // Always allow for now
  req.user = { id: 'guest', role: 'admin' };
  next();
};

exports.requireRole = (role) => (req, res, next) => {
  // Always allow
  next();
};
