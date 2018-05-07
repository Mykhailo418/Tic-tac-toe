const User = require('../../models/users');

module.exports = function(passport){

	passport.serializeUser((user, done) => {
		done(null, user._id); // uses _id as idField
	});

	passport.deserializeUser(async function(id, done) {
		await User.getUserById(id).then(function(user){
		  	if(user){
		  		done(null, user);
		  	}else{
		  		done(404);
		  	}	
		});
	});

}