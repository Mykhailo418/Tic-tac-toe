(function(){

let isYourTurn;
let turn_title_el;
let sign = 'x';
let gameWrapper
let socket_global;
let room_global;

function init(){
	isYourTurn = null;
 	turn_title_el= null;
	sign = 'x';
	gameWrapper= null
	socket_global= null;
	room_global= null;
}

function output_turn_title(){
	if(turn_title_el){
		if(isYourTurn){
			turn_title_el.textContent = 'Your turn now.'
		}else{
			turn_title_el.textContent = 'Opponent turn now.'
		}
	}
}

function playing(e){
	e.preventDefault();
	let target = e.target;
	if(target.tagName == 'TD'){
		target.innerHTML = '<span>'+sign+'</span>';
	}else if(target.tagName == 'SPAN'){
		target.innerHTML = sign;
	}
}

function waiting_for_player(check = true){
	let modal_body = gameWrapper.querySelector('.modal-body');
	if(check === true){
		let div = document.createElement('div');
		div.className = 'waiting';
		div.textContent = 'Waiting for Player...';
		modal_body.append(div);
	}else{
		let waiting_el = modal_body.querySelector('.waiting');
		waiting_el.remove();
	}
}

function close_game_fun(e){
	e.preventDefault();
	socket_global.emit('close_game', room_global.id);
}

window.run_game_fun = function(socket, isMyTurn, room){
	if(socket){
		console.log('-- ROOM GAME', room);
		init();
		socket_global = socket;
		room_global = room;
		document.body.classList.add('modal-open');
		isYourTurn = isMyTurn;
		if(!isYourTurn){ sign = '0'; }

		gameWrapper = document.getElementById('gameWrapper');
		turn_title_el = document.getElementById('turnTitle');
		let closegame_btn = gameWrapper.querySelector('[data-closegame]');
		let table_el = gameWrapper.querySelector('table');

		output_turn_title();
		table_el.addEventListener('click', playing);
		closegame_btn.addEventListener('click', close_game_fun);

		if(room.people < 2){
			waiting_for_player();
		}

		socket_global.on('room_closed', function(id){
			console.log('room global', room_global)
			if(room_global && room_global.id == id){
				gameWrapper.remove();
				socket_global.emit('leave_room', id);
				init();
				socket_global.removeListener('room_closed', this);
				socket_global.removeListener('user_joined_room', waiting_for_player);
			}
		});
		socket_global.on('user_joined_room', waiting_for_player);
	}else{
		waiting_for_player(false);
	}
}	
})();