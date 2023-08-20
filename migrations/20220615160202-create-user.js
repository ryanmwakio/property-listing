'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      userLocation: {
        type: Sequelize.STRING
      },
      profilePlatform: {
        type: Sequelize.STRING
      },
      userTypeId: {
        type: Sequelize.INTEGER
      },
      membershipLevelId: {
        type: Sequelize.INTEGER
      },
      userImage: {
        type: Sequelize.STRING
      },
      isVerified: {
        type: Sequelize.BOOLEAN
      },
      updatedBy: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      website: {
        type: Sequelize.STRING
      },
      facebook: {
        type: Sequelize.STRING
      },
      twitter: {
        type: Sequelize.STRING
      },
      instagram: {
        type: Sequelize.STRING
      },
      linkedin: {
        type: Sequelize.STRING
      },
      youtube: {
        type: Sequelize.STRING
      },
      otp: {
        type: Sequelize.STRING
      },
      otpCreationTime: {
        type: Sequelize.STRING
      },
      profileCompletionPercentage: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};