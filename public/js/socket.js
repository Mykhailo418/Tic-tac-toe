(function(){
const socket = io();
const rooms_list_el = document.getElementById('roomsList');
const loading_el = document.querySelector('.loading');
const create_room_brn = document.getElementById('createRoomBtn');
const footer = document.querySelector('footer');

let rooms_list;
let playing = false;

// -- Socket

socket.on('rooms_list', function(data){
	console.log('Rooms list',data);
	rooms_list = data;
	output_rooms_list();
});

socket.on('play_game', function(data){
	console.log('play_game', data);
	rooms_list = data.rooms;
	playing = true;
	output_rooms_list();
	fecth_get_req('/public/html/game.html', (html) => {
		footer.insertAdjacentHTML('afterend', html);
		run_game_fun(socket, data.userTurn,  get_room_by_id(data.id));
	});
});

create_room_brn.addEventListener('click', function(e){
	e.preventDefault();
	socket.emit('create_room', true);
	set_loading();
})

// -- Help functuons

function init(){
	set_loading();
	socket.emit('rooms_list', true);
}

function set_loading(check = true){
	if(check){
		loading_el.removeAttribute('hidden');
		rooms_list_el.setAttribute('hidden', true);
	}else{
		rooms_list_el.removeAttribute('hidden');
		loading_el.setAttribute('hidden', true);
	}
}

function output_rooms_list(){
	set_loading(false);
	rooms_list_el.innerHTML = '';
	if(!rooms_list || !rooms_list.length){
		let li = document.createElement('li');
		li.className = 'no-rooms';
		li.textContent = 'There are no rooms';
		rooms_list_el.append(li);
		return;
	}
	let li_no_rooms = document.querySelector('.no-rooms');
	if(li_no_rooms){ li_no_rooms.remove(); }
	for(let i = 0; i < rooms_list.length; i++){
		let li = document.createElement('li');
		let a = document.createElement('a');
		a.href = '#';
		a.textContent = rooms_list[i].title + '(' + rooms_list[i].people + '/2)';
		a.dataset.id = rooms_list[i].id;
		a.addEventListener('click', function(e){
			e.preventDefault();
			let id = e.target.dataset.id;
			console.log('join room ', id);
			socket.emit('join_room', id);
			console.log('Room index', id);
		});
		li.append(a);
		rooms_list_el.append(li);
	}
}

function fecth_get_req(url, callback){
	fetch(url, {
	    method: 'get',
	}).then(async (res) => {
		let type = res.headers.get('Content-Type');
		console.log('response = ',res,type);
		if(type.indexOf('text/plain') > -1 || type.indexOf('text/html') > -1){
			return res.text();
		}else if(type.indexOf('application/json') > -1){
			return res.json();
		}
	})
	.then((data) => {
		//console.log('response - data = ',data);
		callback(data);
	}).catch((e) => {
		console.error('Custom Fetch Error', e);
	});
}

function get_room_by_id(id){
	for(let room of rooms_list){
		if(room.id == id){
			return room;
		}
	}
}

init();

})();