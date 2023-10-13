'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Command extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'userId'});

    }
  }
  Command.init({
    command: DataTypes.STRING,
    state: DataTypes.STRING,
    step: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Command',
  });
  return Command;
};