// User profile

module.exports = function({getCSRFWithSession, existingVerifiedUserData, request, users, pick, getURL, User}){
	return function(){
		let dataSession = {};
        before(function(done) {
        	getCSRFWithSession (dataSession, ['/','login'], done);
        });

        it("login as an verified user", function(done) {
            let data_send = Object.assign({"_csrf": dataSession.csrf}, pick(existingVerifiedUserData,['login', 'password']));
            dataSession.testSession
                .post('login')
                .send(data_send)
                .end(function (err, data) {
                    if (err) return new Error(err);
                    data.statusCode.should.eql(200);
                    data.body.success.should.eql(true);
                    data.body.location.should.containEql(users.existingVerifiedUser._id.toString());
                    return done();
                })
            ;       
        });

        it("get user profile", function(done) {
        	dataSession.testSession
        		.get(`user/${users.existingVerifiedUser._id}`)
        		.end(function (err, data) {
        			data.statusCode.should.eql(200);
	        		data.request.url.should.containEql(users.existingVerifiedUser._id.toString());
        			return done();
        		});
        });
	}
}