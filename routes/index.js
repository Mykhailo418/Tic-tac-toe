const Router = require('koa-router');
const router = new Router();
const {check_authorize} = require('../helpers');

module.exports = function(app){
	// Basic
	router.get('/', require('./home').get);
	app.use(router.routes());

	
	//Users
}