const favicon = require('koa-favicon');

module.exports = (app) =>{
	app.use(favicon(__dirname + '/../favicon.ico'));
}