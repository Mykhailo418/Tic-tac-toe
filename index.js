// long stack trace (+clarify from co) if needed
if (process.env.TRACE || true) {
  require('./libs/trace');
}
const port = require('./configs/default').port;
const app = require('./app');

app.listen(port);