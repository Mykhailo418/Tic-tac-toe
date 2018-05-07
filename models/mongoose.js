const mongoose = require('mongoose');
const db_config = require('../configs/default').db;
mongoose.Promise = Promise;
mongoose.set('debug', true);

mongoose.connect(db_config.host, {
  server: {
    socketOptions: {
      keepAlive: 1
    },
    poolSize: 5
  }
});

module.exports = mongoose;