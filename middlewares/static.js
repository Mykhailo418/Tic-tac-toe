//const serve = require('koa-static');
var serve = require('koa-static-server')

//module.exports = app => app.use(serve('public'));
module.exports = app => app.use(serve({rootDir: 'public', rootPath: '/public'}));
