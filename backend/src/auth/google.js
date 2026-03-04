const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] && profile.emails[0].value && profile.emails[0].value.toLowerCase();
      if (!email) return done(new Error('No email found in Google profile'));

      let user = await User.findOne({ email });
      if (!user) {
        const isAdmin = ADMIN_EMAILS.includes(email);
        user = await User.create({
          email,
          name: profile.displayName || email.split('@')[0],
          googleId: profile.id,
          role: isAdmin ? 'admin' : 'operator'
        });
      } else {
        // ensure googleId stored
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
} else {
  console.log('Google OAuth not configured (missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET)');
}

module.exports = passport;
