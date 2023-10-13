const { Model, DataTypes} = require('sequelize');
const sequelize = require('../index');
const {Good} = require("./index");

class History extends Model { }

History.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    new_price_uah: { type: DataTypes.DECIMAL },
    old_price_uah: { type: DataTypes.DECIMAL },

    new_price_usd: { type: DataTypes.DECIMAL },
    old_price_usd: { type: DataTypes.DECIMAL },
    // category_id: { type: DataTypes.INTEGER, }
},{
    sequelize,
    modelName: 'history'
});



module.exports = History;