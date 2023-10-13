const { Model, DataTypes} = require('sequelize');
const sequelize = require('../index');

class TrackedGood extends Model { }

TrackedGood.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    min_percent: { type: DataTypes.TINYINT }
},{
    sequelize,
    modelName: 'tracked_good'
});



module.exports = TrackedGood;