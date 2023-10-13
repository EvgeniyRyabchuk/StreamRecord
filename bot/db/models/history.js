'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Good }) {
      // define association here
      this.belongsTo(Good, { foreignKey: 'goodId'});
    }
  }
  History.init({
    new_price_uah: DataTypes.DECIMAL,
    old_price_uah: DataTypes.DECIMAL,
    new_price_usd: DataTypes.DECIMAL,
    old_price_usd: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};