const pick = require('lodash/pick');

const userPublisFields = ['login', 'email', 'password'];

module.exports = (schemaStatics, methods) => {
	schemaStatics.registerUser = async function(data){
		return await this.create(pick(data,userPublisFields));
	}
	schemaStatics.getUserById = async function(id) {
		if(!methods.checkValidUserId(id)){
			new Error(404, 'Invalid id')
		}
		return await this.findById(id).then((data) => {
			if(!data){
				new Error(404, 'Cannot find user');
			}
			return data;
		}).catch((err) => {
			new Error(500, err);
		});
	}
}