'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Good extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Category, TrackedGood }) {
      // define association here
      this.belongsTo(Category, { foreignKey: 'categoryId' });

      this.hasMany(TrackedGood, {
        foreignKey: 'goodId'
      })
    }
  }
  Good.init({
    name: DataTypes.STRING,
    url: DataTypes.STRING,
    price_uah: DataTypes.DECIMAL,
    price_usd: DataTypes.DECIMAL,
    dollar: DataTypes.DECIMAL,
    article: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Good',
  });
  return Good;
};