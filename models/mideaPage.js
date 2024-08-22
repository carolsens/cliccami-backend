'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MideaPage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MideaPage.belongsTo(models.Page, { foreignKey: 'page_id', as: 'page' });

      MideaPage.belongsTo(models.Midea, { foreignKey: 'midea_id', as: 'midea' });
    }
  }
  MideaPage.init({
    midea_id: DataTypes.INTEGER,
    page_id: DataTypes.INTEGER,
    sort: DataTypes.INTEGER,
    account_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'MideaPage',
    tableName: 'midea_page',
  });
  return MideaPage;
};