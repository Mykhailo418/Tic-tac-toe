const Router = require('koa-router');
const router = new Router({prefix: '/user'});
const {check_authorize} = require('../../helpers');

module.exports = function(app){
	router.get('/:id', check_authorize, require('./profile').get);
	router.get('/:id/rooms', check_authorize, require('./rooms').get);
	app.use(router.routes());
}