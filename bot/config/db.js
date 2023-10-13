const path = require('path');
const storage = path.join(__dirname, '../database/test-db.sqlite');

module.exports = {
  "development": {
    dialect: 'sqlite',
    storage,
  },
  "test": {
    "username": "user",
    "password": "pass",
    "database": "test-db",
    "host": "127.0.0.1",
    "dialect": "sqlite"
  },
  "production": {
    "username": "user",
    "password": "pass",
    "database": "test-db",
    "host": "127.0.0.1",
    "dialect": "sqlite"
  }
}
