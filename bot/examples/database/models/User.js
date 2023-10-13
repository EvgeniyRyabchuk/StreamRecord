const { Model, DataTypes} = require('sequelize');
const sequelize = require('../index');

class User extends Model { }

User.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    chatId: { type: DataTypes.INTEGER, unique: true},
    name: {type: DataTypes.STRING},
},{
    sequelize,
    modelName: 'user'
});

module.exports = User;