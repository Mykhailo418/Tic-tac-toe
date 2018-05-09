const Router = require('koa-router');
const router = new Router();
const {check_authorize} = require('../helpers');

module.exports = function(app){
	// Basic
	router.get('/', require('./home').get);
	router.get('/register', require('./register').get);
	router.get('/verify', require('./verify').get);
	router.post('/register', require('./register').post);
	app.use(router.routes());

	
	//Users
}