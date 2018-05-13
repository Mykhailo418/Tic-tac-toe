const mongoose = require('mongoose');
const {mode, db: db_config} = require('../configs/default');

mongoose.Promise = Promise;
mongoose.set('debug', mode == 'test');

mongoose.connect(db_config.host, {
  server: {
    socketOptions: {
      keepAlive: 1
    },
    poolSize: 5
  }
});

module.exports = mongoose;