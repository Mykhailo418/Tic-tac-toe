const Router = require('koa-router');
const router = new Router({prefix: '/user'});
const {check_authorize} = require('../../helpers');

module.exports = function(app){
	// Basic
	router.get('/:id',check_authorize, require('./profile').get);
	app.use(router.routes());

	
	//Users
}