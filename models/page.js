'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Page extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Page.belongsTo(models.Site, { foreignKey: 'site_id', as: 'site' });

      Page.hasMany(models.MideaPage, { foreignKey: 'page_id', as: 'mideaPages' });
    }
  }
  Page.init({
    type: DataTypes.STRING,
    site_id: DataTypes.INTEGER,
    account_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Page',
    tableName: 'page',
  });
  return Page;
};