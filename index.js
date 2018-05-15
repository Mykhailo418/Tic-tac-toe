// long stack trace (+clarify from co) if needed
if (process.env.TRACE || true) {
  require('./libs/trace');
}
const port = require('./configs/default').port;
const app = require('./app');
const socket = require('./libs/socket');

const server = app.listen(port);
socket(server);