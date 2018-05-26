const winston = require('winston');

module.exports = app => app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (e.status) {
      // could use template methods to render error page
      ctx.body = e.message;
      ctx.status = e.status;
      winston.error(e);
    } else {
      let status = (typeof e == 'number') ? e : 500;
      ctx.body = 'Error ' + status;
      ctx.status = status;
      console.error('-- ERROR:',e.message, e.stack);
      winston.error(e);
    }

  }
});
