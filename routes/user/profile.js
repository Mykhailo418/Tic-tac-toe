// '/user/:id' route
const User = require('../../models/users');
const {get_template_data} = require('../../helpers');
const pick = require('lodash/pick');

exports.get = async function(ctx, next){
	let id = ctx.session.passport.user;
	if(id != ctx.params.id){
		await ctx.throw(403,'Forbidden');
		return;
	}
	await User.getUserById(ctx.params.id).then(async (user) => {
		console.log('User for template',user);
		if(!user){ return ctx.throw(404); }
		if(user && !user.verified){
			return ctx.throw(401, 'You account is not verified'); 
		}
		await ctx.render('user.ejs', get_template_data(ctx, {
			user: pick(user, ['email', 'login', 'createdAt', 'updatedAt']),
		}) );
	});
}