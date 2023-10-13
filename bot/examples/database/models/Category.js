const { Model, DataTypes} = require('sequelize');
const sequelize = require('../index');
const Good = require("./Good");

class Category extends Model { }

Category.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    url: { type: DataTypes.STRING}
},{
    sequelize,
    modelName: 'category'
});



module.exports = Category;

