const bcrypt = require('bcrypt');
const axios = require('axios');
const User = require('../../models').User;
const Token = require('../../models').Token;
const UserType = require('../../models').UserType;
const jwt = require('jsonwebtoken');
const validator = require('validator');
const sharp = require('sharp');

exports.getCurrentLoggedInProfile = async (req, res) => {
  // get token from header
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  const user = await User.findOne({ where: { id: decoded.id } });

  // remove password from the response
  user.password = 'password not returned to client for security reasons';

  if (user) {
    return res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'User found',
      body: user,
      error: [],
    });
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 404,
      message: 'User not found',
      body: {},
      error: ['User not found'],
    });
  }
};

exports.getProfileById = async (req, res) => {
  //get the id from the url
  const id = req.query.id;

  //make sure id is provided
  if (!id) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 400,
      message: 'Id is required to get profile',
      body: {},
      error: ['Id is required to get profile'],
    });
  }

  // check if user trying to get profile is the same user or an admin or superadmin
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  // get types from userTypes table
  const userTypes = await UserType.findAll();
  let userTypeIds = [];
  for (let i = 0; i < userTypes.length; i++) {
    userTypeIds.push(userTypes[i].id);
  }

  if (
    decoded.id !== id &&
    decoded.userTypeId !== userTypeIds[0] &&
    decoded.userTypeId !== userTypeIds[1]
  ) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 401,
      message: 'Unauthorized',
      body: {},
      error: ['Unauthorized'],
    });
  }

  const user = await User.findOne({ where: { id: id } });

  if (!user) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 404,
      message: 'User not found',
      body: {},
      error: ['User not found'],
    });
  }

  // remove password from the response
  user.password = 'password not returned to client for security reasons';

  if (user) {
    return res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'User found',
      body: user,
      error: [],
    });
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 404,
      message: 'User not found',
      body: {},
      error: ['User not found'],
    });
  }
};

exports.getProfileByEmail = async (req, res) => {
  //get the email from the url
  const email = req.query.email;

  //make sure email is provided
  if (!email) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 400,
      message: 'Email is required to get profile',
      body: {},
      error: ['Email is required to get profile'],
    });
  }
  // check if user trying to get profile is the same user or an admin or superadmin
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  // get types from userTypes table
  const userTypes = await UserType.findAll();
  let userTypeIds = [];
  for (let i = 0; i < userTypes.length; i++) {
    userTypeIds.push(userTypes[i].id);
  }

  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 404,
      message: 'User not found',
      body: {},
      error: ['User not found'],
    });
  }

  if (
    decoded.email !== email &&
    decoded.userTypeId !== userTypeIds[0] &&
    decoded.userTypeId !== userTypeIds[1]
  ) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 401,
      message: 'Unauthorized',
      body: {},
      error: ['Unauthorized'],
    });
  }

  if (user) {
    return res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'User found',
      body: user,
      error: [],
    });
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 404,
      message: 'User not found',
      body: {},
      error: ['User not found'],
    });
  }
};

exports.calculateProfilePercentage = async (req, res) => {
  // get token from header
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  let user = await User.findOne({ where: { id: decoded.id } });

  if (!user) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 404,
      message: 'User not found',
      body: {},
      error: ['User not found'],
    });
  }

  let profilePercentage = 0;
  let completedFields = [];
  let allFields = [
    'username',
    'email',
    'password',
    'userlocation',
    'userTypeId',
    'profilePlatform',
    'membershipLevel',
    'userImage',
    'isVerified',
    'updatedBy',
    'phone',
    'website',
    'facebook',
    'twitter',
    'instagram',
    'linkedin',
    'youtube',
    'otp',
  ];

  for (let i = 0; i < allFields.length; i++) {
    if (user[allFields[i]]) {
      completedFields.push(allFields[i]);
    }
  }

  //calculate the percentage based on the number of completed fields and the total number of fields
  profilePercentage = Math.round(
    (completedFields.length / allFields.length) * 100
  );

  //if the profile is complete then set the profilePercentage to 100
  if (profilePercentage === 100) {
    profilePercentage = 100;
  }

  return res.json({
    successful: true,
    status: 'success',
    statusCode: 200,
    message: 'Profile percentage calculated',
    body: { percentage: profilePercentage },
    error: [],
  });
};

exports.postUpdateProfile = async (req, res) => {
  // get token from header
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  let user = await User.findOne({ where: { id: decoded.id } });

  if (user) {
    //check if the user is trying to update their own profile
    if (user.id !== decoded.id) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 403,
        message: 'You are not authorized to update this profile',
        body: {},
        error: ['You are not authorized to update this profile'],
      });
    }

    //if email is provided then check if it is unique
    if (req.body.email) {
      let userWithEmail = await User.findOne({
        where: { email: req.body.email },
      });

      if (userWithEmail) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'Email already exists',
          body: {},
          error: ['Email already exists'],
        });
      }
    }

    //if username is provided then check if it is unique
    if (req.body.username) {
      let userWithUsername = await User.findOne({
        where: { username: req.body.username },
      });

      if (userWithUsername) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'Username already exists',
          body: {},
          error: ['Username already exists'],
        });
      }
    }

    // validate website url if not empty string, if not valid then return error
    if (req.body.website) {
      if (!validator.isURL(req.body.website)) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'Website is not a valid url',
          body: {},
          error: ['Website is not a valid url'],
        });
      }
    }

    // validate facebook url if not empty string, if not valid then return error
    if (req.body.facebook) {
      if (!validator.isURL(req.body.facebook)) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'Facebook is not a valid url',
          body: {},
          error: ['Facebook is not a valid url'],
        });
      }
    }

    // validate twitter url if not empty string, if not valid then return error
    if (req.body.twitter) {
      if (!validator.isURL(req.body.twitter)) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'Twitter is not a valid url',
          body: {},
          error: ['Twitter is not a valid url'],
        });
      }
    }

    // validate instagram url if not empty string, if not valid then return error
    if (req.body.instagram) {
      if (!validator.isURL(req.body.instagram)) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'Instagram is not a valid url',
          body: {},
          error: ['Instagram is not a valid url'],
        });
      }
    }

    // validate linkedin url if not empty string, if not valid then return error
    if (req.body.linkedin) {
      if (!validator.isURL(req.body.linkedin)) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'Linkedin is not a valid url',
          body: {},
          error: ['Linkedin is not a valid url'],
        });
      }
    }

    // validate youtube url if not empty string, if not valid then return error
    if (req.body.youtube) {
      if (!validator.isURL(req.body.youtube)) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'Youtube is not a valid url',
          body: {},
          error: ['Youtube is not a valid url'],
        });
      }
    }

    // validate phone number if not empty string, if not valid then return error
    if (req.body.phone) {
      if (!validator.isMobilePhone(req.body.phone, 'any')) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'Phone number is not valid',
          body: {},
          error: ['Phone number is not valid'],
        });
      }
    }

    //if password is provided then hash it
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // process image

    user.username = req.body.username ? req.body.username : user.username;
    user.email = user.email;
    user.password = user.password;
    user.userlocation = user.userlocation;
    user.userTypeId = user.userTypeId;
    user.profilePlatform = user.profilePlatform;
    user.membershipLevelId = user.membershipLevel;
    user.isVerified = user.isVerified;

    user.userImage = user.userImage;
    user.updatedBy = decoded.email ? decoded.email : user.updatedBy;
    user.phone = req.body.phone ? req.body.phone : user.phone;
    user.website = req.body.website ? req.body.website : user.website;
    user.facebook = req.body.facebook ? req.body.facebook : user.facebook;
    user.twitter = req.body.twitter ? req.body.twitter : user.twitter;
    user.instagram = req.body.instagram ? req.body.instagram : user.instagram;
    user.linkedin = req.body.linkedin ? req.body.linkedin : user.linkedin;
    user.youtube = req.body.youtube ? req.body.youtube : user.youtube;
    user.otp = user.otp;

    let updatedUser = await user.save();

    // remove the password from the response
    updatedUser.password =
      'password is not returned to client for security reasons';

    return res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: `profile updated for ${user.username}`,
      body: updatedUser,
      error: [],
    });
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 404,
      message: 'User not found',
      body: {},
      error: ['User not found'],
    });
  }
};

exports.makeUserAdmin = async (req, res) => {
  try {
    const userEmail = req.body.email;

    //make sure email is provided
    if (!userEmail) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'Email is required',
        body: {},
        error: ['Email is required'],
      });
    }

    // get token from header
    const token = req.headers.authorization;
    const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

    const user = await User.findOne({ where: { email: userEmail } });

    if (user) {
      //check user is not already an admin

      // get user types
      const userTypes = await UserType.findAll();
      if (!userTypes) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'User types not found',
          body: {},
          error: ['User types not found'],
        });
      }
      let adminTypeId = userTypes[1].dataValues.id;

      if (user.userTypeId === adminTypeId) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'User is already an admin',
          body: {},
          error: ['User is already an admin'],
        });
      }

      // check if user trying to make admin is an admin
      if (
        decoded.userTypeId !== userTypes[1].dataValues.id &&
        decoded.userTypeId !== userTypes[0].dataValues.id
      ) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'Not authorized to make user admin',
          body: {},
          error: ['Not authorized to make user admin'],
        });
      }

      user.userTypeId = adminTypeId;
      user.updateBy = decoded.email;

      await user.save();
      // remove the password from the response
      user.password = 'password is not returned to client for security reasons';
      user.otp = 'otp not returned to client for security reasons';

      return res.json({
        successful: true,
        status: 'success',
        statusCode: 200,
        message: 'User made admin',
        body: user,
        error: [],
      });
    } else {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 404,
        message: 'User not found',
        body: {},
        error: ['User not found'],
      });
    }
  } catch (err) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 500,
      message: 'Internal server error',
      body: {},
      error: ['Internal server error'],
    });
  }
};

exports.makeUserLandlord = async (req, res) => {
  // get token from header
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  const userEmail = req.body.email;

  //make sure email is provided
  if (!userEmail) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 400,
      message: 'Email is required',
      body: {},
      error: ['Email is required'],
    });
  }

  const user = await User.findOne({ where: { email: userEmail } });
  if (!user) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 404,
      message: 'User not found',
      body: {},
      error: ['User not found'],
    });
  }

  // get user types
  const userTypes = await UserType.findAll();
  if (!userTypes) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 400,
      message: 'User types not found',
      body: {},
      error: ['User types not found'],
    });
  }

  let landlordTypeId = userTypes[4].dataValues.id;

  if (user) {
    //check user is not already a landlord
    if (user.userTypeId === landlordTypeId) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'User is already a landlord',
        body: {},
        error: ['User is already a landlord'],
      });
    }

    // check if user trying to make landlord is an admin

    user.type = landlordTypeId;
    user.updateBy = decoded.email;

    // remove the password from the response
    await user.save();
    user.password = 'password is not returned to client for security reasons';
    user.otp = 'otp not returned to client for security reasons';

    return res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'User made landlord',
      body: user,
      error: [],
    });
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 404,
      message: 'User not found',
      body: {},
      error: ['User not found'],
    });
  }
};

exports.makeUserAgent = async (req, res) => {
  // get token from header
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  const userEmail = req.body.email;

  //make sure email is provided
  if (!userEmail) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 400,
      message: 'Email is required',
      body: {},
      error: ['Email is required'],
    });
  }

  const user = await User.findOne({ where: { email: userEmail } });
  if (!user) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 404,
      message: 'User not found',
      body: {},
      error: ['User not found'],
    });
  }

  if (user) {
    // get user types
    const userTypes = await UserType.findAll();
    if (!userTypes) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'User types not found',
        body: {},
        error: ['User types not found'],
      });
    }

    let agentTypeId = userTypes[2].dataValues.id;

    //check user is not already an agent
    if (user.userTypeId === agentTypeId) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'User is already an agent',
        body: {},
        error: ['User is already an agent'],
      });
    }
    user.userTypeId = agentTypeId;
    user.updateBy = decoded.email;

    await user.save();
    // remove the password from the response
    user.password = 'password is not returned to client for security reasons';
    user.otp = 'otp not returned to client for security reasons';
    return res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'User made agent',
      body: user,
      error: [],
    });
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 404,
      message: 'User not found',
      body: {},
      error: ['User not found'],
    });
  }
};

exports.makeUserNormal = async (req, res) => {
  // get token from header
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  const userEmail = req.body.email;

  //make sure email is provided
  if (!userEmail) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 400,
      message: 'Email is required',
      body: {},
      error: ['Email is required'],
    });
  }

  const user = await User.findOne({ where: { email: userEmail } });
  if (user) {
    //check user is not already a normal user
    if (user.type === 'normal') {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'User is already a normal user',
        body: {},
        error: ['User is already a normal user'],
      });
    }
    user.type = 'normal';
    user.permissions = 'normal';
    user.updateBy = decoded.email;

    await user.save();
    return res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'User made normal',
      body: user,
      error: [],
    });
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 404,
      message: 'User not found',
      body: {},
      error: ['User not found'],
    });
  }
};

exports.makeUserSuper = async (req, res) => {
  // get token from header
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  const userEmail = req.body.email;

  //make sure email is provided
  if (!userEmail) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 400,
      message: 'Email is required',
      body: {},
      error: ['Email is required'],
    });
  }

  const user = await User.findOne({ where: { email: userEmail } });

  if (!user) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 404,
      message: 'User not found',
      body: {},
      error: ['User not found'],
    });
  }

  if (user) {
    // get user types
    const userTypes = await UserType.findAll();
    if (!userTypes) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'User types not found',
        body: {},
        error: ['User types not found'],
      });
    }

    let superTypeId = userTypes[0].dataValues.id;

    //check user is not already a super user
    if (user.userTypeId === superTypeId) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'User is already a super user',
        body: {},
        error: ['User is already a super user'],
      });
    }

    if (decoded.userTypeId !== superTypeId) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'Unauthorized to make user a super user',
        body: {},
        error: ['Unauthorized to make user a super user'],
      });
    }

    user.userTypeId = superTypeId;
    user.updateBy = decoded.email;

    await user.save();

    user.password = 'password is not returned to client for security reasons';
    user.otp = 'otp not returned to client for security reasons';

    return res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'User made super',
      body: user,
      error: [],
    });
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 404,
      message: 'User not found',
      body: {},
      error: ['User not found'],
    });
  }
};

exports.deleteLoggedInUser = async (req, res) => {
  // get token from header
  const token = req.headers.authorization;
  const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

  const userEmail = decoded.email;

  //make sure email is provided
  if (!userEmail) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 400,
      message: 'Email is required',
      body: {},
      error: ['Email is required'],
    });
  }

  const user = await User.findOne({ where: { email: userEmail } });

  if (!user) {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 404,
      message: 'User not found',
      body: {},
      error: ['User not found'],
    });
  }

  if (user) {
    // get user types
    const userTypes = await UserType.findAll();
    if (!userTypes) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'User types not found',
        body: {},
        error: ['User types not found'],
      });
    }

    let superTypeId = userTypes[0].dataValues.id;
    let adminTypeId = userTypes[1].dataValues.id;
    if (
      decoded.email !== user.email &&
      decoded.userTypeId !== superTypeId &&
      decoded.userTypeId !== adminTypeId
    ) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'Unauthorized to delete user',
        body: {},
        error: ['Unauthorized to delete user'],
      });
    }

    user.updateBy = decoded.email;
    // remove Token from database
    const token = await Token.findOne({ where: { userId: user.id } });
    if (token) {
      await token.destroy();
    }

    await user.destroy();

    return res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'User deleted',
      body: {},
      error: [],
    });
  } else {
    return res.json({
      successful: false,
      status: 'error',
      statusCode: 404,
      message: 'User not found',
      body: {},
      error: ['User not found'],
    });
  }
};
