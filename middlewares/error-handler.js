module.exports = app => app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (e.status) {
      // could use template methods to render error page
      ctx.flash('error','Status: '+e.status + ', ' + e.message);
      ctx.body = {status: false, location: '/'};
      ctx.status = e.status;

    } else {
      ctx.flash('error','Status: 500, ' + e.message);
      ctx.body = {status: false, location: '/'};
      ctx.status = 500;
      console.error(ctx, e.message, e.stack);
    }

  }
});
