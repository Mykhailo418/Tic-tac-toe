// POST /login

module.exports = function({getCSRFWithSession, pick, existingUserData, users, existingVerifiedUserData, newUserData}){
	return function() {
        let dataSession = {};
        before(done => {
            getCSRFWithSession (dataSession, '/login', done);
        });
        it("login as not registered user", function(done) {
            let data_send = Object.assign({"_csrf": dataSession.csrf}, pick(newUserData,['login', 'password']));
            dataSession.testSession
                .post('')
                .send(data_send)
                .end(function (err, data) {
                    if (err) return new Error(err);
                    data.statusCode.should.eql(404);
                    return done();
                })
            ;       
        });
        it("login as an unverified user", function(done) {
            let data_send = Object.assign({"_csrf": dataSession.csrf}, pick(existingUserData,['login', 'password']));
            dataSession.testSession
                .post('')
                .send(data_send)
                .end(function (err, data) {
                    if (err) return new Error(err);
                    data.statusCode.should.eql(404);
                    return done();
                })
            ;       
        });
    }
}