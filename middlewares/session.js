const session = require('koa-session');
const mongooseStore = require('koa-session-mongoose');
const store = require('../libs/sessionStore');

module.exports = app => app.use(session({
  key:     'sid',
  httpOnly:  true,
  path:      '/',
  overwrite: true,
  signed:    false, // by default true (not needed here)
  maxAge:    3600 * 4 * 1e3, // session expires in 4 hours, remember me lives longer

  // touch session.updatedAt in DB & reset cookie on every visit to prolong the session
  // koa-session-mongoose resaves the session as a whole, not just a single field
  rolling: true,

  store

}, app));