const socketIO = require('socket.io');
//const socketRedis = require('socket.io-redis');

let rooms = [];
const max_people = 2;
const win_combination = [
	[1,2,3],
	[4,5,6],
	[7,8,9],

	[1,4,7],
	[2,5,8],
	[3,6,9],

	[1,5,9],
	[3,5,7],
];

function socket(server) {
	let io = socketIO(server);

	//io.adapter(socketRedis({ host: 'localhost', port: 6379 }));

	io.use(require('./auth'));

	// Socket IO Connection
	io.on('connection', function(socket){
	  	console.log('new user connected');

	  	socket.on('rooms_list', () => {
	  		socket.emit('rooms_list', rooms);
	  	});

	  	socket.on('close_game', (id) => {
	  		let room = get_room_by_id(id);
	  		io.in(room.title).emit('room_closed', id);
	  	});

	  	socket.on('end_turn', (data) => {
	  		let room = get_room_by_id(data.room_id);
	  		if(room){
		  		if(!room.turns){ room.turns = {} }
		  		if(!room.turns[data.number]){
		  			room.turns[data.number] = socket.id;
		  			if(check_win(room, socket.id)){
		  				socket.emit('win', true);
		  				socket.to(room.title).emit('lose', true);
		  			}else{
			  			socket.to(room.title).emit('end_turn', data.number);
			  		}
			  	}
			 }
	  	});

	  	socket.on('leave_room', (id) => {
	  		let room = get_room_by_id(id);
	  		if(room){
	  			socket.leave(room.title);
	  			remove_room_by_id(id);
	  			socket.emit('rooms_list', rooms);
	  			socket.broadcast.emit('rooms_list', rooms);
	  		}
	  	});

	  	socket.on('create_room', () => {
	  		let index = rooms.length + 1;
	  		let room = {
	  			id: 'room' + index,
	  			title: 'room_' + index,
	  			people: 0
	  		};
	  		rooms.push(room);
	  		join_user_room(socket, room, true);
	  		socket.broadcast.emit('rooms_list', rooms);
	  	});

	  	socket.on('join_room', (id) => {
	  		let room = get_room_by_id(id);
	  		join_user_room(socket, room, false)
	  		socket.to(room.title).emit('user_joined_room', id);
	  	});

	});

	function join_user_room(socket, room, userTurn){
		if(room && room.people < max_people){
	  		socket.join(room.title);
	  		room.people ++;
	  		socket.emit('play_game', {
	  			rooms,
	  			id: room.id,
	  			userTurn
	  		});
	  	}
	}

	function get_room_by_id(id){
		for(let room of rooms){
			if(room.id == id){
				return room;
			}
		}
	}

	function remove_room_by_id(id){
		for(let index in rooms){
			if(rooms[index].id == id){
				rooms.splice(index, 1);
				return true;
			}
		}
		return false;
	}

	function check_win(room, socket_id){
		if(room.turns){
			for(let i = 0; i < win_combination.length; i++){
				let comb = win_combination[i];
				if(room.turns[comb[0]] == room.turns[comb[1]] && 
					room.turns[comb[1]] == room.turns[comb[2]] && 
					room.turns[comb[2]] == socket_id
				){
					return true;
				}
			}
		}
		return false;
	}
}

/*let socketEmitter = require('socket.io-emitter');
let redisClient = require('redis').createClient();
socket.emitter = socketEmitter(redisClient);*/

module.exports = socket;