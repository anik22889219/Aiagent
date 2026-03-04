const rateLimit = require('express-rate-limit');

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests, please try again later.' },
});

exports.generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 500,
});
