'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Parameter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Parameter.init({
    account_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    value: DataTypes.STRING,
    site_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Parameter',
    tableName: 'parameter',
  });
  return Parameter;
};