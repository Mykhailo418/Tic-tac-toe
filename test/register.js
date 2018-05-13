// POST /register

module.exports = function(request, getURL, getCSRFWithSession, newUserData, existingUserData){
	return function() {
    	let dataSession = {};
    	before(done => {
    		getCSRFWithSession (dataSession, '/register', done)
    	});

    	it("creates a user", function(done) {
    		let data_send = Object.assign({"_csrf":dataSession.csrf}, newUserData);
        	dataSession.testSession
			    .post('')
			    .send(data_send)
			    .end(function (err, data) {
			        if (err) return new Error(err);
			        data.statusCode.should.eql(200);
			        data.body.success.should.eql(true);
			        return done();
			    })
			;       
        });

        it("creates an existing user", function(done) {
    		let data_send = Object.assign({"_csrf":dataSession.csrf}, existingUserData);
        	dataSession.testSession
			    .post('')
			    .send(data_send)
			    .end(function (err, data) {
			        if (err) return new Error(err);
			        data.statusCode.should.eql(500);
			        return done();
			    })
			;       
        });

        it("if email not valid", function(done) {
            let data_send = {
                login: 'vasya',
                email: "john@test",
                password: "12345678",
                "_csrf": dataSession.csrf
            };
            dataSession.testSession
                .post('')
                .send(data_send)
                .end(function (err, data) {
                    if (err) return new Error(err);
                    data.statusCode.should.eql(500);
                    return done();
                })
            ;      
        });
    };
}