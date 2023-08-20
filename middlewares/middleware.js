const path = require('path');

const User = require('../models').User;
const Token = require('../models').Token;
const UserType = require('../models').UserType;
const Lisitng = require('../models').Lisitng;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const jwt = require('jsonwebtoken');
const tokenSecret = process.env.TOKEN_SECRET;

// get all userTypes

exports.isUserVerified = (req, res, next) => {
  // get token from header
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  if (decoded.isVerified) {
    next();
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 403,
      message:
        'user is not verified, please verify your account using the code sent to your email or phone number',
      body: {
        user: req.user,
      },
      error: [
        'user is not verified, please verify your account using the code sent to your email or phone number',
      ],
    });
  }
};

exports.isUserAdmin = async (req, res, next) => {
  // get token from header
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  // get from userType id where userType === admin using sequelize
  const userType = await UserType.findOne({
    where: {
      userType: 'admin',
    },
  });
  let userTypeIdFromDb = userType.id;

  if (decoded.userTypeId === userTypeIdFromDb) {
    next();
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 403,
      message: 'user is does not have permissions',
      body: {
        user: req.user,
      },
      error: ['user does not have permissions'],
    });
  }
};

exports.isUserLandloard = async (req, res, next) => {
  // get token from header
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  const userType = await UserType.findOne({
    where: {
      userType: 'landlord',
    },
  });
  let userTypeIdFromDb = userType.id;

  if (decoded.userTypeId === userTypeIdFromDb) {
    next();
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 403,
      message: 'user does not have permissions',
      body: {
        user: req.user,
      },
      error: ['user does not have permissions'],
    });
  }
};

exports.isUserAgent = async (req, res, next) => {
  // get token from header
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  const userType = await UserType.findOne({
    where: {
      userType: 'agent',
    },
  });
  let userTypeIdFromDb = userType.id;

  if (decoded.userTypeId === userTypeIdFromDb) {
    next();
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 403,
      message: 'user does not have permissions',
      body: {
        user: req.user,
      },
      error: ['user does not have permissions'],
    });
  }
};

exports.isUserSuper = async (req, res, next) => {
  // get token from header
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  const userType = await UserType.findOne({
    where: {
      userType: 'super',
    },
  });
  let userTypeIdFromDb = userType.id;

  if (decoded.userTypeId === userTypeIdFromDb) {
    next();
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 403,
      message: 'user is not super',
      body: {
        user: req.user,
      },
      error: ['user is not super'],
    });
  }
};

exports.isUserNormal = async (req, res, next) => {
  // get token from header
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  const userType = await UserType.findOne({
    where: {
      userType: 'super',
    },
  });
  let userTypeIdFromDb = userType.id;

  if (decoded.userTypeId === userTypeIdFromDb) {
    next();
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 403,
      message: 'user is not logged in',
      body: {
        user: req.user,
      },
      error: ['user is not logged in'],
    });
  }
};

exports.isUserLoggedIn = async (req, res, next) => {
  try {
    // get token from header
    const token = req.headers.authorization;

    if (!token)
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 403,
        message: 'please provide a token',
        body: {},
        error: ['please provide a token'],
      });

    // verify token
    jwt.verify(
      token.split(' ')[1],
      process.env.TOKEN_SECRET,
      async (err, value) => {
        if (err)
          return res.json({
            successful: false,
            status: 'error',
            statusCode: 403,
            message: 'token is not valid',
            body: {},
            error: ['token is not valid'],
          });

        //check  if token is expired if expired tell user to login again
        if (value.exp < Date.now() / 1000) {
          return res.json({
            successful: false,
            status: 'error',
            statusCode: 403,
            message: 'token has expired, please login again',
            body: {},
            error: ['token has expired, please login again'],
          });
        }

        //get user from token
        const decoded = jwt.verify(
          token.split(' ')[1],
          process.env.TOKEN_SECRET
        );

        if (!decoded.id)
          return res.json({
            successful: false,
            status: 'error',
            statusCode: 403,
            message: 'user is not logged in',
            body: {},
            error: ['user is not logged in'],
          });

        // check if token is similar to the token in the database
        const tokenFromDb = await Token.findOne({
          where: {
            userId: decoded.id,
          },
        });

        if (!tokenFromDb)
          return res.json({
            successful: false,
            status: 'error',
            statusCode: 403,
            message: 'user is not logged in',
            body: {},
            error: ['user is not logged in'],
          });

        if (tokenFromDb.token !== token.split(' ')[1]) {
          return res.json({
            successful: false,
            status: 'error',
            statusCode: 403,
            message: 'user is not logged in',
            body: {},
            error: ['user is not logged in'],
          });
        }

        next();
      }
    );
  } catch (err) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 403,
      message: 'user is not logged in',
      body: {},
      error: ['user is not logged in'],
    });
  }
};

exports.isUserAdminOrSuper = async (req, res, next) => {
  // get token from header
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  // get from userType id where userType === admin or userType === superadmin using sequelize
  const userType = await UserType.findOne({
    where: {
      id: decoded.userTypeId,
    },
  });

  if (userType.userType === 'admin' || userType.userType === 'superadmin') {
    next();
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 403,
      message: 'user does not have permissions',
      body: {
        user: req.user,
      },
      error: ['user does not have permissions'],
    });
  }
};

// check if user is agent or landlord or super or admin
exports.isUserAgentOrLandloardOrSuperOrAdmin = async (req, res, next) => {
  // get token from header
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  const userType = await UserType.findOne({
    where: {
      id: decoded.userTypeId,
    },
  });

  if (
    userType.userType === 'agent' ||
    userType.userType === 'landlord' ||
    userType.userType === 'superadmin' ||
    userType.userType === 'admin' ||
    userType.userType === 'realtor'
  ) {
    next();
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 403,
      message: 'user does not have permissions',
      body: {
        user: req.user,
      },
      error: ['user does not have permissions'],
    });
  }
};

exports.isUserSuperAdmin = async (req, res, next) => {
  // get token from header
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  const userType = await UserType.findOne({
    where: {
      id: decoded.userTypeId,
    },
  });

  if (userType.userType === 'superadmin') {
    next();
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 403,
      message: 'user does not have permissions',
      body: {
        user: req.user,
      },
      error: ['user does not have permissions'],
    });
  }
};
