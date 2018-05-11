// '/logout' route

exports.get = async function(ctx, next){
	await ctx.logout();
	ctx.session = null;
	ctx.redirect('/login');
}