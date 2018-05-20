(function(){

let isYourTurn;
let turn_title_el;
let sign = 'x';
let opponent_sign = 'x';
let gameWrapper
let socket_global;
let room_global;

function init(){
	isYourTurn = null;
 	turn_title_el= null;
	sign = 'x';
	opponent_sign = 'x';
	gameWrapper= null
	socket_global= null;
	room_global= null;
}

function output_turn_title(){
	if(turn_title_el){
		if(isYourTurn){
			turn_title_el.textContent = 'Your turn now.';
			gameWrapper.classList.remove('disable-turn');
		}else{
			turn_title_el.textContent = 'Opponent turn now.';
			gameWrapper.classList.add('disable-turn');
		}
	}
}

function playing(e){
	e.preventDefault();
	if(isYourTurn){
		let target = e.target;
		while (target.tagName != 'TABLE') {
		    if (target.tagName == 'TD') {
		    	if(!target.dataset.marked){
		    		target.innerHTML = '<span>'+sign+'</span>';
		    		target.dataset.marked = true;
		    		isYourTurn = false;
		    		output_turn_title();
		    		socket_global.emit('end_turn',{ 
		    			room_id: room_global.id,
		    			number: target.dataset.number
		    		});
		    	}
		      return;
		    }
		    target = target.parentNode;
		}
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
	console.log('room_global = ',room_global);
	socket_global.emit('close_game', room_global.id);
}

function end_game_fun(win = false){
	let text = 'You lose!';
	if(win){ text = 'You win!'; }
	let modal_body = gameWrapper.querySelector('.modal-body');
	let div = document.createElement('div');
	let br = document.createElement('br');
	let btn_close = document.createElement('button');
	btn_close.addEventListener('click', close_game_fun);
	btn_close.className = 'btn btn-success';
	btn_close.textContent = 'Close Window';
	div.className = 'end_game';
	div.textContent = text;
	div.append(br);
	div.append(btn_close);
	modal_body.append(div);
}

window.run_game_fun = function(socket, isMyTurn, room){
	if(socket){
		console.log('-- ROOM GAME', room);
		init();
		socket_global = socket;
		room_global = room;
		document.body.classList.add('modal-open');
		isYourTurn = isMyTurn;
		if(!isYourTurn){ sign = '0'; }else{ opponent_sign = '0'; }

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
				socket_global.removeListener('room_closed', this);
				socket_global.removeListener('user_joined_room', waiting_for_player);
				socket_global.removeListener('win', win_func);
				socket_global.removeListener('lose', lose_func);
				init();
			}
		});
		socket_global.on('user_joined_room', waiting_for_player);
		socket_global.on('end_turn', function(number){
			let td = table_el.querySelector(`[data-number="${number}"]`);
			td.innerHTML = '<span>'+opponent_sign+'</span>';
		    td.dataset.marked = true;
		    isYourTurn = true;
		    output_turn_title();
		});
		 function win_func(){
			console.log('WIIIN');
			end_game_fun(true);
		}
		 function lose_func(){
			console.log('LOOOOSE');
			end_game_fun(false);
		}
		socket_global.on('win', win_func);
		socket_global.on('lose', lose_func);
	}else{
		waiting_for_player(false);
	}
}	
})();