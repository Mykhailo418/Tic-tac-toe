// '/' route

exports.get = async function(ctx, next) {
	return await ctx.render('home.ejs', { currentYear: new Date().getFullYear() });
};