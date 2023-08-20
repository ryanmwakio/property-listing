const User = require('../../../models').User;

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      scope: ['profile', 'email'],
    },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOrCreate({
        where: {
          email: profile.emails[0].value,
        },
        defaults: {
          username: profile.given_name,
          email: profile.email,
          password: '',
          userLocation: '',
          user_location: '',
          type: 'normal',
          permissions: 'normal',
          profilePlatform: 'google',
          membershipLevel: 'normal',
          userImage: profile.photos[0].value,
          isVerified: true,
          updatedBy: '',
          phone: '',
          website: '',
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: '',
          youtube: '',
          otp: '',
        },
      })
        .then(([user, created]) => {
          if (created) {
            return done(null, user);
          }
          return done(null, user);
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
