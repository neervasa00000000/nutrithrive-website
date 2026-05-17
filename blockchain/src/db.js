const config = require('./config');

module.exports =
  config.db.driver === 'mysql' ? require('./db-mysql') : require('./db-sqlite');
