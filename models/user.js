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
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    password: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user'
  });
  return User;
};