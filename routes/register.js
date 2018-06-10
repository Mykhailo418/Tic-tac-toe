// '/register' route
const {get_template_data} = require('../helpers');
const User = require('../models/users');
const sendMail = require('../libs/sendMail');

exports.get = async function(ctx, next) {
	return await ctx.render('register.ejs', get_template_data(ctx));
};

exports.post = async function(ctx, next) {
	console.log('-- Register Body', ctx.request.body);
	await User.registerUser(ctx.request.body).then(async function(data) {
			if(data){
				/*let letter = await sendMail({
	              template:     'hello',
	              subject:      'Hello from Tic Tac Toe',
	              to:           data.email,
	              name:         data.login,
	              token:        data.token
	            });
	            if(letter){
					ctx.flash('info', 'Verify your email.');
				}*/
				ctx.body = {
					success: true,
					location: '/login'
				};
			}else{
				ctx.throw(404);
			}
		});
};