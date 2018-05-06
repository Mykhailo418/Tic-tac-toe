const Koa = require('koa');
const app = new Koa();

// Configs and middlewares
const config = require('./configs/default');
const middlewares = require('./configs/middlewares');

middlewares.forEach(middleware => require('./middlewares/' + middleware)(app));

// Routes
/*const router = new Router({prefix: '/users'});
app.use(router.routes());
-- OR --
const users_route = require('./routes/users');
app.use(users_route.routes());*/

module.exports = app;