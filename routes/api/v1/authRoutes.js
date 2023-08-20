var express = require('express');
var router = express.Router();
var passport = require('passport');
var middleware = require('../../../middlewares/middleware');

var authController = require('../../../controllers/v1/authController');

router.post('/register', authController.postRegister);
router.post('/verify-otp', authController.postVerifyOtp);
router.post('/login', authController.postLogin);

// confirm email before password reset
router.post(
  '/reset-password-confirm-email',
  authController.postResetPasswordConfirmEmail
);

//reset password
router.post('/reset-password', authController.postResetPassword);

// login
router.post('/logout', middleware.isUserLoggedIn, authController.postLogout);

//google oauth2
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.SUCCESS_REDIRECT,
    failureRedirect: process.env.FAILURE_REDIRECT,
  })
);

module.exports = router;
