const passport = require('../libs/passport');
const passport_session = require('koa-passport').session();

module.exports = app => {
	app.use(passport.initialize());
	app.use(passport_session);
};