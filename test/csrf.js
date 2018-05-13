// Check CSRF

module.exports = function(request, getURL) {
	return function(){
	   	it("Register page", async function() {
	           let response = await request({
	               method: 'post',
	               uri: getURL('/register'),
	               json: true,
	               body: {}
	           });
	           response.statusCode.should.eql(403);
	    });
	    it("Login page", async function() {
	           let response = await request({
	               method: 'post',
	               uri: getURL('/login'),
	               json: true,
	               body: {}
	           });
	           response.statusCode.should.eql(403);
	    });
	}
}