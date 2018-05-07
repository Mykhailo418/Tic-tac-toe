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