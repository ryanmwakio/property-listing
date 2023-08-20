'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Listings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      bedrooms: {
        type: Sequelize.INTEGER
      },
      bathrooms: {
        type: Sequelize.INTEGER
      },
      sqft: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      yearBuilt: {
        type: Sequelize.INTEGER
      },
      parking: {
        type: Sequelize.BOOLEAN
      },
      pets: {
        type: Sequelize.BOOLEAN
      },
      furnished: {
        type: Sequelize.BOOLEAN
      },
      wifi: {
        type: Sequelize.BOOLEAN
      },
      image1Url: {
        type: Sequelize.TEXT
      },
      image2Url: {
        type: Sequelize.TEXT
      },
      image3Url: {
        type: Sequelize.TEXT
      },
      image4Url: {
        type: Sequelize.TEXT
      },
      image5Url: {
        type: Sequelize.TEXT
      },
      videoUrl: {
        type: Sequelize.TEXT
      },
      floorPlanUrl: {
        type: Sequelize.TEXT
      },
      image1Name: {
        type: Sequelize.TEXT
      },
      image2Name: {
        type: Sequelize.TEXT
      },
      image3Name: {
        type: Sequelize.TEXT
      },
      image4Name: {
        type: Sequelize.TEXT
      },
      image5Name: {
        type: Sequelize.TEXT
      },
      videoName: {
        type: Sequelize.TEXT
      },
      floorPlanName: {
        type: Sequelize.TEXT
      },
      location: {
        type: Sequelize.STRING
      },
      available: {
        type: Sequelize.BOOLEAN
      },
      city: {
        type: Sequelize.STRING
      },
      featured: {
        type: Sequelize.BOOLEAN
      },
      createdBy: {
        type: Sequelize.STRING
      },
      updatedBy: {
        type: Sequelize.STRING
      },
      forRent: {
        type: Sequelize.BOOLEAN
      },
      forSale: {
        type: Sequelize.BOOLEAN
      },
      county: {
        type: Sequelize.TEXT
      },
      views: {
        type: Sequelize.INTEGER
      },
      latitude: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.STRING
      },
      region: {
        type: Sequelize.STRING
      },
      published: {
        type: Sequelize.BOOLEAN
      },
      verified: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Listings');
  }
};