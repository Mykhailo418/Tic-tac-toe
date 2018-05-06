// in-memory store by default (use the right module instead)
const session = require('koa-session');

module.exports = app => app.use(session({
  cookie: {
    signed: false
  }
}, app));

