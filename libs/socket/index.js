const socketIO = require('socket.io');
const socketRedis = require('socket.io-redis');

let rooms = [];
const max_people = 2;

function socket(server) {
	let io = socketIO(server);

	io.adapter(socketRedis({ host: 'localhost', port: 6379 }));

	io.use(require('./auth'));

	// Socket IO Connection
	io.on('connection', function(socket){
	  	console.log('new user connected');

	  	socket.on('rooms_list', () => {
	  		socket.emit('rooms_list', rooms);
	  	});

	  	socket.on('create_room', () => {
	  		rooms.push({
	  			title: 'room_' + (rooms.length + 1),
	  			people: 0
	  		});
	  		socket.emit('rooms_list', rooms);
	  		join_user_room(socket, rooms.length - 1);
	  	});

	  	socket.on('join_room', (index) => {
	  		if(rooms[index] && rooms[index].people < max_people){
	  			join_user_room(socket, index)
	  		}
	  	});

	});

	function join_user_room(socket, index){
		if(rooms[index] && rooms[index].people < max_people){
	  		socket.join(rooms[index].title);
	  		rooms[index].people ++;
	  		socket.emit('play_game', {
	  			rooms,
	  			index
	  		});
	  	}
	}
}

let socketEmitter = require('socket.io-emitter');
let redisClient = require('redis').createClient();
socket.emitter = socketEmitter(redisClient);

module.exports = socket;