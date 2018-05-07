const pick = require('lodash/pick');

const userPublisFields = ['email'];

module.exports = (schemaStatics, methods) => {
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