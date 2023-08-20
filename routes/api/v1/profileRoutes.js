var express = require('express');
var router = express.Router();
var middleware = require('../../../middlewares/middleware');

var profileController = require('../../../controllers/v1/profileController');
const { route } = require('./authRoutes');

// get current user profile
router.get(
  '/profile/me',
  middleware.isUserLoggedIn,
  profileController.getCurrentLoggedInProfile
);

router.put(
  '/profile/update-profile',
  middleware.isUserLoggedIn,
  profileController.postUpdateProfile
);

router.get(
  '/profile/get-by-id',
  middleware.isUserLoggedIn,
  profileController.getProfileById
);

router.get(
  '/profile/get-by-email',
  middleware.isUserLoggedIn,
  profileController.getProfileByEmail
);

router.post(
  '/profile/make-admin',
  middleware.isUserLoggedIn,
  profileController.makeUserAdmin
);
router.post(
  '/profile/make-landlord',
  middleware.isUserLoggedIn,
  profileController.makeUserLandlord
);
router.post(
  '/profile/make-agent',
  middleware.isUserLoggedIn,
  profileController.makeUserAgent
);
router.post(
  '/profile/make-normal',
  middleware.isUserLoggedIn,
  profileController.makeUserNormal
);
router.post(
  '/profile/make-super',
  middleware.isUserLoggedIn,
  profileController.makeUserSuper
);

router.get(
  '/profile/calculate-percentage',
  middleware.isUserLoggedIn,
  profileController.calculateProfilePercentage
);

router.delete(
  '/profile/delete-profile',
  middleware.isUserLoggedIn,
  profileController.deleteLoggedInUser
);

module.exports = router;
