// '/verify' route

exports.get = async function(ctx, next){
	return await ctx.render('verify.ejs', { 
		currentYear: new Date().getFullYear()
	});
};