// '/user/:id' route
const User = require('../../models/users');
const {get_template_data, check_user_verification} = require('../../helpers');
const pick = require('lodash/pick');

exports.get = async function(ctx, next){
	await check_user_verification(ctx, User).then(async function(user){
		await ctx.render('user.ejs', get_template_data(ctx, {
			user: pick(user, ['email', 'login', 'createdAt', 'updatedAt']),
		}) );
	});
}