//WIP - To Do: Validate reCAPTCHA
const formReg = document.getElementById('form-register');
const formLog = document.getElementById('form-login');

const errorElement = document.getElementById('error');

/*
function initCaptcha() {
	grecaptcha.render('post-form-captcha', {'sitekey': '6Lff6eQZAAAAACLF0onsK7F-oXM95R0-RvZKQ99s'});
	grecaptcha.render('report-captcha', {'sitekey': '6Lff6eQZAAAAACLF0onsK7F-oXM95R0-RvZKQ99s'});
}
//Check Captcha
function isCaptchaChecked() {
	return grecaptcha && grecaptcha.getResponse(0).length !== 0;
}
*/

formReg.addEventListener('submit', (e) => {
	e.preventDefault();
	let messages = [];

	let id = $.trim( $('[name=id-register]').val() );
	let key = $.trim( $('[name=key-register]').val() );
	let password = $.trim( $('[name=password-register]').val() );
	let passwordRepeat = $.trim( $('[name=password-repeat]').val() );

	if ( id === '' )
	  messages.push('ID Required');

	if ( key === '' )
		messages.push('Key Required');

	if ( password === '' ) {
		messages.push('Password Required');
	} else if ( password.length < 8 ) {
		messages.push('Password Must Be More Than 8 Characters');
	} else if ( passwordRepeat !== password ) {
		messages.push('Passwords Do Not Match');
	}

	//DEACTIVATE REGISTER BUTTON WHILE AJAX IS PROCESSING
	$.ajax({
		type: 'post',
		url: '/xeroxed',
		data: {'id-register': id, 'password-register': password, 'key-register': key},
		success: (response) => {
			console.log('fires')
			//REACTIVATE REGISTER BUTTON
			if (!response.result) {
				messages.push(response.message);
			}

			if(messages.length > 0) {
				errorElement.innerText = messages.join(', ')
				return;
			}

			//ON SUCCESS
			//show response.message
			//wait 2 secs or smth
			//redirect to modview

			return;
		},
		error: (e) => {
			console.log(e)
		}
	}); 

});
