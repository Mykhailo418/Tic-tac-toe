const Koa = require('koa');
const app = new Koa();

// Configs and middlewares
const config = require('./configs/default');
const middlewares = require('./configs/middlewares');

// Windsotn Logs
var winston = require('winston');
require('winston-mongodb');
winston.add(winston.transports.MongoDB, {
    db : config.db.host,
    collection : 'logs',
});

middlewares.forEach(middleware => require('./middlewares/' + middleware)(app));

// Routes
require('./routes/index')(app);
require('./routes/user/index')(app);

module.exports = app;