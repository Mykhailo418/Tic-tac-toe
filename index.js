// long stack trace (+clarify from co) if needed
if (process.env.TRACE || true) {
  require('./libs/trace');
}
const port = require('./configs/default').port;
const app = require('./app');
const socket = require('./libs/socket');
const config = require('./configs/default');
// Windsotn Logs
var winston = require('winston');
require('winston-mongodb');
winston.add(winston.transports.MongoDB, {
    db : config.db.host,
    collection : 'logs',
});

const server = app.listen(port);
socket(server);

process.on('unhandledRejection', (e) => {
	winston.error(e);
	process.exit(255);
});