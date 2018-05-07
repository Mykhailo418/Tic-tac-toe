const passport = require('koa-passport');

require('./serialize')(passport);
require('./localStrategy')(passport);

module.exports = passport;