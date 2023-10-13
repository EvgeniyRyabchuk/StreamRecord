'use strict';
const {
  Model, DataTypes, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Scan, Good }) {
      // define association here
      this.hasMany(Scan, {
        foreignKey: 'categoryId'
      });

      this.hasMany(Good, {
        foreignKey: 'categoryId'
      });
    }
  }
  Category.init({
    id: { type: Sequelize.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    name: {type: Sequelize.STRING},
    url: { type: Sequelize.STRING}
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories'
  });
  return Category;
};