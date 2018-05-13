// '/login' route
const {get_template_data} = require('../helpers');
const passport = require('koa-passport');

exports.get = async function(ctx, next){
 	return await ctx.render('login.ejs', get_template_data(ctx));
}

exports.post = async function(ctx, next){
		console.log('-- BODY', ctx.request.body);
	await passport.authenticate('local', {
	    successRedirect: '/',
	    failureRedirect: '/',
	    failureFlash: true 
	  }, async function(err, user, info){
	  	if(err){ return ctx.throw(400, err); }
	  	if(!user){
	  		ctx.status = 404;
	  		if(info && info.message){
	  			ctx.body = info.message;
	  		}
	  	}else{
	  		await ctx.login(user);
	  		ctx.body = {
	  			success: true,
	  			location: '/user/'+user._id
	  		}
	  	}
	  })(ctx, next);
}