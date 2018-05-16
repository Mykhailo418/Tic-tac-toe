(function(){
const socket = io();
const rooms_list_el = document.getElementById('roomsList');
const loading_el = document.querySelector('.loading');
const create_room_brn = document.getElementById('createRoomBtn');

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
	set_loading();
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
		a.dataset.index = i;
		a.addEventListener('click', function(e){
			e.preventDefault();
			let index = e.target.dataset.index;
			socket.emit('join_room', index);
			console.log('Room index', index);
		});
		li.append(a);
		rooms_list_el.append(li);
	}
}

init();

})();