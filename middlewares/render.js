var views = require('koa-views');
const public = require('../configs/default').public;

// Must be used before any router is used
module.exports = app => app.use(views(public.html));