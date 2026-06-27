/**
 * ============================================
 * PASSPORT CONFIGURATION
 * Google OAuth 2.0 Strategy
 * ============================================
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const logger = require('../utils/logger');

// Check if Google OAuth is configured
const isGoogleConfigured = !!(
  process.env.GOOGLE_CLIENT_ID && 
  process.env.GOOGLE_CLIENT_SECRET
);

if (isGoogleConfigured) {
  /**
   * Google OAuth Strategy
   */
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          logger.info('Google OAuth callback received', { profileId: profile.id });
          
          // Extract user information from Google profile
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          
          if (!email) {
            return done(new Error('No email found in Google profile'), null);
          }
          
          const googleId = profile.id;
          const fullName = profile.displayName || '';
          
          // Check if user exists with this Google ID
          let user = await User.findByGoogleId(googleId);
          
          if (user) {
            // User exists, update last login
            await User.updateLastLogin(user.id);
            logger.info('Existing Google user logged in', { userId: user.id, email });
            return done(null, user);
          }
          
          // Check if user exists with this email
          user = await User.findByEmail(email);
          
          if (user) {
            // User exists with email, link Google account
            await User.linkGoogleAccount(user.id, googleId);
            logger.info('Google account linked to existing user', { userId: user.id, email });
            return done(null, user);
          }
          
          // Create new user
          user = await User.create({
            fullName,
            email,
            googleId,
            emailVerified: true, // Google emails are pre-verified
            password: null, // No password for Google OAuth users
          });
          
          logger.info('New user created via Google OAuth', { userId: user.id, email });
          return done(null, user);
          
        } catch (error) {
          logger.error('Google OAuth error:', error);
          return done(error, null);
        }
      }
    )
  );
  
  logger.info('✅ Google OAuth strategy configured');
} else {
  logger.warn('⚠️  Google OAuth not configured - skipping strategy initialization');
}

/**
 * Serialize user for session
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * Deserialize user from session
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
