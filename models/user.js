'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    userLocation: DataTypes.STRING,
    profilePlatform: DataTypes.STRING,
    userTypeId: DataTypes.INTEGER,
    membershipLevelId: DataTypes.INTEGER,
    userImage: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN,
    updatedBy: DataTypes.STRING,
    phone: DataTypes.STRING,
    website: DataTypes.STRING,
    facebook: DataTypes.STRING,
    twitter: DataTypes.STRING,
    instagram: DataTypes.STRING,
    linkedin: DataTypes.STRING,
    youtube: DataTypes.STRING,
    otp: DataTypes.STRING,
    otpCreationTime: DataTypes.STRING,
    profileCompletionPercentage: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};