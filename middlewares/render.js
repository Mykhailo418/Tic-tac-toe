var views = require('koa-views');
const public = require('../configs/default').public;

module.exports = app => {
	app.use(views(public.html, {
	  map: {
	    html: 'ejs'
	  }
	}));
};