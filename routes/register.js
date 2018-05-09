// '/register' route
const {get_template_data} = require('../helpers');
const User = require('../models/users');

exports.get = async function(ctx, next) {
	return await ctx.render('register.ejs', get_template_data(ctx));
};

exports.post = async function(ctx, next) {
	console.log('-- Register Body', ctx.request.body);
	await User.registerUser(ctx.request.body).then((data) => {
			if(data){
				ctx.body = {
					success: true,
					location: '/verify'
				};
			}else{
				ctx.throw(404);
			}
		});
};