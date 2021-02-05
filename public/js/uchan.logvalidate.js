//WIP - To Do: Validate reCAPTCHA
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

formLog.addEventListener('submit', (e) => {
	let messages = [];

	if ( $.trim( $('[name=id-login]').val() ) == '' )
	  messages.push('ID Required');

	if ( $.trim( $('[name=password-login]').val() ) == '' )
		messages.push('Password Required');

/*
	if (!isCaptchaChecked()) {
	  messages.push("Captcha Missing");
	}
*/

	for(let i = 0; i < messages.length; i++) {
		console.log(messages[i])
	}

	if(messages.length > 0) {
		e.preventDefault();
		errorElement.innerText = messages.join(', ')
	}
});
