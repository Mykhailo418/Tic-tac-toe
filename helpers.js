const crypto = require('crypto');
const {hash: hash_config} = require('./configs/default');

// convert password to hash
module.exports.get_pass_hash = function(password, salt){
	return crypto.pbkdf2Sync(
	    password,
	    salt,
	    hash_config.iterations,
	    hash_config.length,
	    'sha1'
	).toString('base64');
};

module.exports.check_authorize = async function(ctx, next){
	if (!ctx.isAuthenticated()) {
		ctx.status = 302;
		ctx.body = 'Redirecting to login page';
		ctx.redirect('/login');
		return;
	}
	await next();
}

module.exports.get_template_data = function(ctx, data){
	var result = {
		csrf: ctx.csrf,
		isAuth: ctx.isAuthenticated() && ctx.session.passport && ctx.session.passport.user,
		currentYear: new Date().getFullYear(),
		flashMessages: ctx.flash() || [],
		isSocket: false
	};
	return (data) ? Object.assign(result, data) : result;
}

module.exports.generate_token = function(len = 10){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < len; i++){
	    text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}
module.exports.check_user_verification = async function(ctx, user_model){
	let id = ctx.session.passport.user;
	if(id != ctx.params.id){
		await ctx.throw(403,'Forbidden');
		return;
	}
	return await user_model.getUserById(ctx.params.id).then(async (user) => {
		if(!user){ return ctx.throw(404); }
		if(user && !user.verified){
			return ctx.throw(401, 'You account is not verified'); 
		}
		return user;
	});
}