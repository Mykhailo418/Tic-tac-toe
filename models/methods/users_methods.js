const {get_pass_hash} = require('../../helpers');

module.exports = (mongoose, methods) => {
	methods.checkPassword = function(password){
		if (!password) return false;
	  	if (!this.passwordHash) return false;
	  	return get_pass_hash(password, this.salt) == this.passwordHash;
	}
	methods.checkValidUserId = (id) => {
		return mongoose.Types.ObjectId.isValid(id);
	};
}