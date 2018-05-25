// '/logout' route
const socket = require('../libs/socket');

exports.get = async function(ctx, next){
	// socket io logout semd message
	if (ctx.session.socketIds) {
	    ctx.session.socketIds.forEach(function(socketId) {
	      console.log("emit to", socketId);
	      socket.emitter.to(socketId).emit('logout');
	    });
	 }
	await ctx.logout();
	ctx.session = null;
	ctx.redirect('/login');
}