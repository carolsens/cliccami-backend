'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Site extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Site.hasMany(models.Page, { foreignKey: 'site_id', as: 'page' });
    }
  }
  Site.init({
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    account_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Site',
    tableName: 'site',
  });
  return Site;
};