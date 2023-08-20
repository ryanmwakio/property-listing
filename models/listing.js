'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Listing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Listing.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    bedrooms: DataTypes.INTEGER,
    bathrooms: DataTypes.INTEGER,
    sqft: DataTypes.INTEGER,
    type: DataTypes.STRING,
    category: DataTypes.STRING,
    yearBuilt: DataTypes.INTEGER,
    parking: DataTypes.BOOLEAN,
    pets: DataTypes.BOOLEAN,
    furnished: DataTypes.BOOLEAN,
    wifi: DataTypes.BOOLEAN,
    image1Url: DataTypes.TEXT,
    image2Url: DataTypes.TEXT,
    image3Url: DataTypes.TEXT,
    image4Url: DataTypes.TEXT,
    image5Url: DataTypes.TEXT,
    videoUrl: DataTypes.TEXT,
    floorPlanUrl: DataTypes.TEXT,
    image1Name: DataTypes.TEXT,
    image2Name: DataTypes.TEXT,
    image3Name: DataTypes.TEXT,
    image4Name: DataTypes.TEXT,
    image5Name: DataTypes.TEXT,
    videoName: DataTypes.TEXT,
    floorPlanName: DataTypes.TEXT,
    location: DataTypes.STRING,
    available: DataTypes.BOOLEAN,
    city: DataTypes.STRING,
    featured: DataTypes.BOOLEAN,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING,
    forRent: DataTypes.BOOLEAN,
    forSale: DataTypes.BOOLEAN,
    county: DataTypes.TEXT,
    views: DataTypes.INTEGER,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    region: DataTypes.STRING,
    published: DataTypes.BOOLEAN,
    verified: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Listing',
  });
  return Listing;
};