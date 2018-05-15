const Cookies = require('cookies');
//const config = require('config');
const co = require('co');
const sessionStore = require('../sessionStore');
const mongooseStore = require('koa-session-mongoose');
const User = require('../../models/users');

module.exports = function(socket, next){
		// save http request 
		let handshakeData = socket.request;

		// get cookies from socket.request ( from headers in request )
		let cookies = new Cookies(handshakeData, {});

		// get from the cookies a 'sid' value
		let cookies_sid = cookies.get('sid');
		let sid = 'koa:sess:' + cookies.get('sid');
		//console.log(cookies_sid);

	// -- START get from the datavase and sessions a user
		co(function* () {
			
			// get session of user by sid
			let result = yield( sessionStore.get(cookies_sid) );
			return result;
		}).then(async function(data) {
			let session = data;

		    if (!session) {
		      throw new Error("No session");
		    }

		    if (!session.passport && !session.passport.user) {
		      throw new Error("Anonymous session not allowed");
		    }

		    // if needed: check if the user is allowed to join
		    // -- find user and save it socket object
		   	socket.user = await User.findById(session.passport.user);

		    // if needed later: refresh socket.session on events
		    // -- save session in socket object
		    socket.session = session;

		    // on restarts may be junk sockedIds
		    // no problem in them
		    // -- save all ids of all sockets of the client(for example if user open in few tabs this app)
		    session.socketIds = session.socketIds ? session.socketIds.concat(socket.id) : [socket.id];
		    console.log(session.socketIds);
		    await sessionStore.set(cookies_sid, session, 86400, {changed: true, rolling: true});
		// -- START clear session in socket if disconnect
		    socket.on('disconnect', function() {
		        co(function* clearSocketId() {
			        yield sessionStore.get(cookies_sid);
				}).then(async function(data){
					let sessions = data;
			        if (session) {
			          session.socketIds.splice(session.socketIds.indexOf(socket.id), 1);
			          await sessionStore.set(cookies_sid, session, 86400, {changed: true, rolling: true});
			        }
			        console.log('user Disconnect ');
			        return;
		        }).catch(function(err) {
		        	console.error("session clear error", err);
		    	});
		    });
		    next();
		// -- END clear session in socket if disconnect
		}).catch(function(err) {
	      	console.error(err);
	      	next(new Error("Error has occured."));
	    });
	// -- END get from the datavase and sessions a user
}