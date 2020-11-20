const name = document.getElementById('name');
const text = document.getElementById('text');
const img  = document.getElementById('postImageInput');
const form = document.getElementById('post-form');

const errorElement = document.getElementById('error');

form.addEventListener('submit', (e) => {
	let messages = [];

	if (name.length > 20) {
		messages.push('Please do not edit the HTML.');
	}

	if (text.length > 2000) {
		messages.push('Please do not edit the HTML.');
	}

	if (img.files.length == 0) {
		messages.push('No image uploaded.');
	}

	if(messages.length > 0) {
		e.preventDefault();
		errorElement.innerText = messages.join(', ')
	}
})