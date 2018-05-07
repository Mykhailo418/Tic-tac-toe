const User = require('../../models/users');
const LocalStrategy = require('passport-local');

module.exports = function(passport){

	passport.use(new LocalStrategy(
		{
			usernameField: 'login',
	    	passwordField: 'password',
	    	passReqToCallback: true
		},
		async function(req, login, password, done) {
		    return await User.findOne({ login }).then((user) => {
			    if (!user || !user.checkPassword(password)) {
			        // don't say whether the user exists
			        return done(null, false, { message: 'There are no such login or password is incorrect' });
			    }
			    return done(null, user);
		    });
		}
	));

}