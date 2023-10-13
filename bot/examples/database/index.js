const Sequelize = require('sequelize');

const sequelize = new Sequelize('test-db', 'user', 'pass', {
    dialect: 'sqlite',
    host: './database/test-db.sqlite'
});

// const User = sequelize.define('User', {
//   id: DataTypes.INTEGER,
//   username: DataTypes.STRING,
//   birthday: DataTypes.DATE,
// });

module.exports = sequelize;