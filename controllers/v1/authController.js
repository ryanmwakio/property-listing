const bcrypt = require('bcrypt');
const axios = require('axios');
const User = require('../../models').User;
const Token = require('../../models').Token;
const UserType = require('../../models').UserType;
const MembershipLevel = require('../../models').MembershipLevel;
const nodeMailer = require('nodemailer');

const jwt = require('jsonwebtoken');
const tokenSecret = process.env.TOKEN_SECRET;
let validator = require('validator');

function generateToken(user) {
  return jwt.sign(user, tokenSecret, {
    expiresIn: '24h',
  });
}

exports.postRegister = async (req, res, next) => {
  try {
    let {
      username,
      email,
      password,
      user_location,
      type,
      userImage,
      phone,
      website,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    userTypeId = 0;

    // get all types from user types table
    const types = await UserType.findAll();
    if (!types || types.length === 0) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'No user types found',
        body: {},
        error: [],
      });
    }

    // check if type has been provided
    if (!type) {
      userTypeId = types[5].dataValues.id;
    } else {
      // trim type and lowercase it
      type = type.trim().toLowerCase();

      // check if user is trying to register as admin or super admin
      if (type === 'admin' || type === 'superadmin') {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'You are not allowed to register as an with this type',
          body: {},
          error: [],
        });
      }

      // check if type is one of the types in the database if not return error

      const typeFound = types.find(
        (the_type) => the_type.dataValues.userType === type
      );

      if (!typeFound) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 400,
          message: 'Invalid type',
          body: {},
          error: [],
        });
      }

      userTypeId = typeFound.dataValues.id;
    }

    //trim the user_name and email
    userName = username.trim();
    email = email.trim();
    password = password;
    user_location = user_location.trim();

    //check if the user_name or email is empty
    if (!userName || !email || !password || !user_location) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 401,
        message: "User name, email, password or location can't be empty",
        body: {},
        error: [err.stack],
      });
    }

    // check if type is realtor or agent or landlord then all the fields are required
    if (type === 'agent' || type === 'landlord' || type === 'realtor') {
      if (!phone || (!website && !facebook && !twitter && !instagram)) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 401,
          message:
            'User phone must be provided. Then provide one of these, website or facebook or twitter or instagram or linkedin at least or all of them',
          body: {},
          error: [
            'User phone must be provided. Then provide one of these, website or facebook or twitter or instagram or linkedin at least or all of them',
          ],
        });
      }
    }

    // //check if password is should be at least 6 characters long and contain at least one number and one letter and one special character
    var strongRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
    );
    if (!strongRegex.test(password)) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 401,
        message:
          'Password should be at least 8 characters long and contain at least one number and one uppercase letter and one special character',
        body: {},
        error: [
          'Password should be at least 8 characters long and contain at least one number and one uppercase letter and one special character',
        ],
      });
    }

    // //check if username is already taken
    let user_Name = await User.findOne({ where: { username: userName } });
    if (user_Name) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 401,
        message: 'Username already taken',
        body: {},
        error: ['Username already taken'],
      });
    }

    // //check if email already exists
    const userEmail = await User.findOne({
      where: {
        email: email,
      },
    });

    //if the email already exists
    if (userEmail) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 401,
        message: 'Email already exists',
        body: {},
        error: ['Email already exists'],
      });
    }

    // //membership level
    let membershipLevelId = 0;
    const membershipLevel = await MembershipLevel.findOne({
      where: {
        membershipLevel: 'normal',
      },
    });
    if (!membershipLevel) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'No membership level found',
        body: {},
        error: [],
      });
    }

    membershipLevelId = membershipLevel.dataValues.id;

    let url = `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_KEY}&query=${user_location}`;
    let response = await axios.get(url);

    if (response.data.data.length === 0) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 401,
        message: 'Invalid location',
        body: {},
        error: ['Invalid location'],
      });
    }

    let location_data = response.data.data[0];

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

    // //encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // //create new user
    const newUser = await User.create({
      username: userName,
      email: email,
      password: hashedPassword,
      userLocation: location_data.name,
      userTypeId: userTypeId,
      profilePlatform: 'manual',
      membershipLevelId: membershipLevelId,
      userImage: '',
      isVerified: false,
      updatedBy: '',
      phone: '' || phone,
      website: '' || website,
      facebook: '' || facebook,
      twitter: '' || twitter,
      instagram: '' || instagram,
      linkedin: '' || linkedin,
      youtube: '',
      otp: '',
    });

    await newUser.save();

    //email verification token
    let transporter = nodeMailer.createTransport({
      host: 'smtp-mail.outlook.com',
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
    });

    // // //generate OTP
    let Otp = `${Math.floor(Math.random() * (9999 - 1000) + 1000)}`;
    //hash the OTP
    const hashedOtp = await bcrypt.hash(Otp, 10);

    //mail options
    let mailOptions = {
      from: process.env.EMAIL_HOST_USER,
      to: email,
      subject: 'OTP Verification',
      html: `<h1>OTP Verification</h1> <p>Hello ${newUser.username}, your verification code is <b>${Otp}</b></p><p>This code expires in 1 hour.</p><hr/><div><img src="https://res.cloudinary.com/dwxeqcqt0/image/upload/v1654197401/imageedit_3_7367614333_purtv0.jpg" style="max-width=100px"/></div>`,
      text: `Your OTP is ${Otp}`,
    };

    await transporter.sendMail(mailOptions);

    // get all userTypes

    // if user is the only user in the database, make them a type super
    const users = await User.findAll();
    if (users.length === 1) {
      await User.update(
        {
          userTypeId: types[0].dataValues.id,
        },
        {
          where: {
            id: newUser.id,
          },
        }
      );
    }

    //update the user with the OTP and authToken
    let token = generateToken(newUser.dataValues);
    let otpcreationtime = new Date().getTime();
    await User.update(
      {
        otp: hashedOtp,
        otpCreationTime: otpcreationtime,
      },
      {
        where: {
          id: newUser.id,
        },
      }
    );

    // add token to the Token table
    let newToken = await Token.create({
      userId: newUser.id,
      token: token,
    });
    await newToken.save();

    newUser.password = 'password not returned to client for security reasons';

    return await res.json({
      successful: true,
      status: 'success',
      statusCode: 201,
      message: `User created successfully, ${newUser.username} check your email for a verification code to verify your account`,
      body: {
        user: newUser,
        Otp: Otp,
        otpCreationTime: otpcreationtime,
        authToken: token,
        user_location: location_data,
      },
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusMessage: 'error',
      statusCode: err.status || 500,
      message: err.message,
      body: {},
      error: [err.stack],
    });
  }
};

exports.postVerifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    // get token from header
    const token = req.headers.authorization;
    const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

    email = decoded.email;

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 401,
        message: 'User not found',
        body: {},
        error: ['User not found'],
      });
    }

    if (user.otpCreationTime + 3600000 < new Date().getTime()) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 401,
        message: 'OTP expired',
        body: {},
        error: ['OTP expired'],
      });
    }

    // check if logged user is the same as the user who sent the OTP
    if (user.id !== decoded.id) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 401,
        message:
          'The user who sent the OTP is not the same as the logged in user',
        body: {},
        error: [
          'The user who sent the OTP is not the same as the logged in user',
        ],
      });
    }

    if (await bcrypt.compare(otp, user.otp)) {
      await User.update(
        {
          isVerified: true,
        },
        {
          where: {
            id: user.id,
          },
        }
      );

      //remove password from user object
      user.password = 'password not returned to client for security reasons';

      return res.json({
        successful: true,
        status: 'success',
        statusCode: 200,
        message: 'User verified successfully',
        body: {
          user: user,
        },
        error: [],
      });
    } else {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 401,
        message: 'OTP does not match',
        body: {},
        error: ['OTP does not match'],
      });
    }
  } catch (err) {
    return res.json({
      successful: false,
      statusMessage: 'error',
      statusCode: err.status || 500,
      message: err.message,
      body: {},
      error: [err.stack],
    });
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 401,
        message: 'User not found',
        body: {},
        error: ['User not found'],
      });
    }

    let authToken = generateToken(user.dataValues);

    if (await bcrypt.compare(password, user.password)) {
      user.dataValues.password =
        'password not returned to client for security reasons';

      // find or create a token for the user
      let token = await Token.findOne({
        where: {
          userId: user.id,
        },
      });
      if (token) {
        await Token.update(
          {
            token: authToken,
          },
          {
            where: {
              userId: user.id,
            },
          }
        );
      } else {
        await Token.create({
          userId: user.id,
          token: authToken,
        });
      }

      return res.json({
        successful: true,
        status: 'success',
        statusCode: 200,
        message: 'User logged in successfully',
        body: {
          user: user.dataValues,
          authToken: authToken,
        },
        error: [],
      });
    } else {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 401,
        message: 'Invalid password',
        body: {},
        error: ['Invalid password'],
      });
    }
  } catch (err) {
    return res.json({
      successful: false,
      statusMessage: 'error',
      statusCode: err.status || 500,
      message: err.message,
      body: {},
      error: [err.stack],
    });
  }
};

exports.postResetPasswordConfirmEmail = async (req, res) => {
  try {
    const { email } = req.body;

    //check if email has been provided
    if (!email) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'Email not provided',
        body: {},
        error: ['Email not provided'],
      });
    }

    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 401,
        message: 'User not found',
        body: {},
        error: ['User not found'],
      });
    }

    //email verification token
    let transporter = nodeMailer.createTransport({
      host: 'smtp-mail.outlook.com',
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
    });

    //generate OTP
    let Otp = `${Math.floor(Math.random() * (9999 - 1000) + 1000)}`;
    //hash the OTP
    const hashedOtp = await bcrypt.hash(Otp, 10);

    //mail options
    let mailOptions = {
      from: process.env.EMAIL_HOST_USER,
      to: email,
      subject: 'Email Verification for Password Reset',
      html: `<h1>Email Verification</h1> <p>Your code is <b>${Otp}</b></p><p>This code expires in 1 hour.</p><hr/><div><img src="https://res.cloudinary.com/dwxeqcqt0/image/upload/v1654197401/imageedit_3_7367614333_purtv0.jpg" style="max-width=100px"/></div>`,
      text: `Your code is ${Otp}`,
    };

    await transporter.sendMail(mailOptions);

    //update user otp
    await User.update(
      {
        otp: hashedOtp,
        otpCreationTime: new Date().getTime(),
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    return res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message:
        'A verification code has been sent to your email or phone number',
      body: {},
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusMessage: 'error',
      statusCode: err.status || 500,
      message: err.message,
      body: {},
      error: [err.stack],
    });
  }
};

exports.postResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // check email has been provided
    if (!email) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'Email not provided',
        body: {},
        error: ['Email not provided'],
      });
    }

    // check otp has been provided
    if (!otp) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'confirmation code not provided. Please check your email',
        body: {},
        error: ['confirmation code not provided. Please check your email'],
      });
    }

    // check new password has been provided
    if (!newPassword) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 400,
        message: 'New password not provided',
        body: {},
        error: ['New password not provided'],
      });
    }

    // //check if password is should be at least 6 characters long and contain at least one number and one letter and one special character
    var strongRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
    );
    if (!strongRegex.test(newPassword)) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 401,
        message:
          'Password should be at least 8 characters long and contain at least one number and one uppercase letter and one special character',
        body: {},
        error: [
          'Password should be at least 8 characters long and contain at least one number and one uppercase letter and one special character',
        ],
      });
    }

    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 401,
        message: 'User not found',
        body: {},
        error: ['User not found'],
      });
    }

    //check if otp is valid
    if (await bcrypt.compare(otp, user.otp)) {
      //check if otp has expired
      if (new Date().getTime() - user.otpCreationTime > 3600000) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 401,
          message: 'verification code has expired',
          body: {},
          error: ['verification code has expired'],
        });
      }

      // check otp is the same as the one hashed in db
      if (await !bcrypt.compare(otp, user.otp)) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 401,
          message: 'verification code is invalid',
          body: {},
          error: ['verification code is invalid'],
        });
      }

      // check newPassword is not similar to password in db
      if (await bcrypt.compare(newPassword, user.password)) {
        return res.json({
          successful: false,
          status: 'error',
          statusCode: 401,
          message: 'password cannot be similar to old password',
          body: {},
          error: ['password cannot be similar to old password'],
        });
      }

      //hash the password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      //update user password
      await User.update(
        {
          password: hashedPassword,
        },
        {
          where: {
            id: user.id,
          },
        }
      );

      return res.json({
        successful: true,
        status: 'success',
        statusCode: 200,
        message: 'Password reset successfully',
        body: {},
        error: [],
      });
    } else {
      return res.json({
        successful: false,
        status: 'error',
        statusCode: 401,
        message: 'Invalid confirmation code',
        body: {},
        error: ['Invalid confirmation code'],
      });
    }
  } catch (err) {
    return res.json({
      successful: false,
      statusMessage: 'error',
      statusCode: err.status || 500,
      message: err.message,
      body: {},
      error: [err.stack],
    });
  }
};

exports.postLogout = async (req, res) => {
  try {
    // get token from header
    const token = req.headers.authorization;
    const decoded = jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET);

    let userId = decoded.id;

    // delete token from db
    await Token.destroy({
      where: {
        userId: userId,
      },
    });

    return res.json({
      successful: true,
      status: 'success',
      statusCode: 200,
      message: 'User logged out successfully',
      body: {},
      error: [],
    });
  } catch (err) {
    return res.json({
      successful: false,
      statusMessage: 'error',
      statusCode: err.status || 500,
      message: err.message,
      body: {},
      error: [err.stack],
    });
  }
};
