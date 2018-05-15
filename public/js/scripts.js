(function(){
	// START FORMS
let forms = document.querySelectorAll(".form");
for(let i = 0 ; i < forms.length; i++){
	forms[i].addEventListener("submit", sumbit_func);
}

function sumbit_func(e){
	e.preventDefault();
	let form = e.target;
	var formData = new FormData(form);
	fetch(form.action, {
	    method: form.method,
	    credentials: "include", 
	    body: formData
	}).then(async (res) => {
		let type = res.headers.get('Content-Type');
		console.log('response = ',res,type);
		if(type.indexOf('text/plain') > -1){
			return res.text();
		}else if(type.indexOf('application/json') > -1){
			return res.json();
		}
	})
	.then((data) => {
		console.log('response - data = ',data);
		if(typeof data == 'object' && data.success && data.location){
			document.location.href = data.location;
		}else if(typeof data == 'string'){
			alert(data);
		}
	}).catch((e) => {
		console.error('Custom Fetch Error', e);
	});
}
// END FORMS

})();