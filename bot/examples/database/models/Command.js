const { Model, DataTypes} = require('sequelize');
const sequelize = require('../index');

class Command extends Model { }

Command.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    command: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    step: { type: DataTypes.INTEGER }
    // category_id: { type: DataTypes.INTEGER, }
},{
    sequelize,
    modelName: 'commad'
});



module.exports = Command;