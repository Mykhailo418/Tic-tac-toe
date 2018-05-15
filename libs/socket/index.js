let socketIO = require('socket.io');

function socket(server) {
	let io = socketIO(server);

	io.use(require('./auth'));

	// Socket IO Connection
	io.on('connection', function(socket){
	  	console.log('new user connected');
	});
}

module.exports = socket;