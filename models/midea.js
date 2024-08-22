'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Midea extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Midea.hasMany(models.MideaPage, { foreignKey: 'midea_id', as: 'mideaPages' });
    }
  }
  Midea.init({
    name: DataTypes.STRING,
    path: DataTypes.STRING,
    path_image: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    width: DataTypes.INTEGER,
    size: DataTypes.INTEGER,
    file_type: DataTypes.STRING,
    status: DataTypes.STRING,
    account_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Midea',
    tableName: 'midea',
  });
  return Midea;
};