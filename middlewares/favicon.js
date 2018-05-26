const favicon = require('koa-favicon');
const winston = require('winston');

module.exports = (app) =>{
	app.use(favicon(__dirname + '/../favicon.ico'));
}