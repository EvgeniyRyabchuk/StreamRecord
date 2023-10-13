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
    static associate({ TrackedGood }) {
      // define association here
      this.hasMany(TrackedGood, {
        foreignKey: 'userId'
      });
    }
  }
  User.init({
    name: DataTypes.STRING,
    chatId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};