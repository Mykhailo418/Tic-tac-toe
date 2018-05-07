const crypto = require('crypto');
const {hash: hash_config} = require('../../configs/default');
const {get_pass_hash} = require('../../helpers');

module.exports = function(userSchema){
	userSchema.virtual('password')
		.set(function (password) {
			this._plainPassword = password;
			if(password){
				this.salt = crypto.randomBytes(hash_config.length).toString('base64');
				this.passwordHash = get_pass_hash(password, this.salt);
			}else{
				this.salt = null;
	      		this.passwordHash = null;
			}
		})
		.get(function (){ return this._plainPassword })
	;

	// Validating
	userSchema.path('passwordHash').validate(function(v) {
	  if (this._plainPassword ) {
	    if (this._plainPassword.length < 4) {
	      this.invalidate('password', 'Password should be more then 4 symbols.');
	    }
	  } 
	}, null);
};