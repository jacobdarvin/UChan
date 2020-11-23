const name = document.getElementById('name');
const text = document.getElementById('text');
const img  = document.getElementById('postImageInput');
const form = document.getElementById('post-form');

const errorElement = document.getElementById('error');

form.addEventListener('submit', (e) => {
	let messages = [];

	if (name.length > 20) {
		messages.push('Please do not edit the HTML. ;)');
	}

	if (text.length > 2000) {
		messages.push('Please do not edit the HTML. ;)');
	}

	if (img.files.size > 1048576 * 2) {
		messages.push('Image exceeds 2MB');
	}

	if (text.value === '' || text.value == null) {
		messages.push('No text inputted');
	}

	for(let i = 0; i < messages.length; i++) {
		console.log(messages[i])
	}

	if(messages.length > 0) {
		e.preventDefault();
		errorElement.innerText = messages.join(', ')
	}
})