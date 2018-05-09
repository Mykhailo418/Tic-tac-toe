const mongoose = require('./mongoose.js');
const { generate_token } = require('../helpers');

const userSchema = new mongoose.Schema({
	login:   {
	    type:     String,
	    required: true
	},
	email: {
		type: String,
		required: 'Email is required',
		unique: true,
		validate: [{
		    validator: function checkEmail(value) {
		        return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
		    },
		    msg: 'Email is not valid.'
	    }],
	    lowercase:  true,
    	trim:       true
	},
	verified: {
		type: Boolean,
		default: false
	},
	token:{
		type: String,
		required: true,
		index: true,
		default: generate_token()
	},
	passwordHash: {
	    type: String,
	    required: true
	},
	salt: {
		type: String,
	    required: true

	}
}, {
	timestamps: true
});

// Virtual
require('./virtuals/users_virtuals')(userSchema);

// Methods
require('./methods/users_methods')(mongoose, userSchema.methods);

// Statics
require('./statics/users_wrap')(userSchema.statics, userSchema.methods);

module.exports = mongoose.model('User', userSchema);