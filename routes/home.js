// '/' route
const {get_template_data} = require('../helpers');

exports.get = async function(ctx, next) {
	return await ctx.render('home.ejs', get_template_data(ctx));
};