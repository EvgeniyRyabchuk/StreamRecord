'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TrackedGood extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Good, User, Command }) {
      // define association here
      this.belongsTo(Good, { foreignKey: 'goodId'});
      this.belongsTo(User, { foreignKey: 'userId'});
    }
  }
  TrackedGood.init({
    min_percent: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'TrackedGood',
  });
  return TrackedGood;
};