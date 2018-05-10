// '/verify' route
const pick = require('lodash/pick');
const User = require('../models/users');

exports.get = async function(ctx, next){
	var params = pick(ctx.query, ['token', 'email']);
	params.verified = false;
	let user = await User.findOne(params);
	if(user){
		await user.set({'verified':true})
		await user.save();
		ctx.flash('success', 'Your email was verified');
	}else{
		ctx.flash('error', 'Sorry. Wrong credentials.');
	}
	ctx.status = 302;
	ctx.body = 'Redirecting to verify page';
	ctx.redirect('/');
}