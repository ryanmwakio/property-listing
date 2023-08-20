'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TopAd extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TopAd.init({
    userid: DataTypes.INTEGER,
    listingid: DataTypes.INTEGER,
    cotPaid: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    stopDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TopAd',
  });
  return TopAd;
};