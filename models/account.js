'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      Account.hasMany(models.User, { foreignKey: 'account_id' });
    }
  };
  Account.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Account',
    tableName: 'account'
  });
  return Account;
};
