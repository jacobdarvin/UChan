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

	if ( $.trim( $('[name=id-register]').val() ) == '' )
	  messages.push('ID Required');

	if ( $.trim( $('[name=key-register]').val() ) == '' )
		messages.push('Key Required');

	if ( $.trim( $('[name=password-register]').val() ) == '' ) {
		messages.push('Password Required');
	} else if ( $.trim( $('[name=password-register]').val().length ) < 8 ) {
		console.log($.trim( $('[name=password-register]').val().length ));
		messages.push('Password Must Be More Than 8 Characters');
	} else if ( $.trim( $('[name=password-repeat]').val() ) != $.trim( $('[name=password-register]').val() ) ) {
		messages.push('Passwords Do Not Match');
	}
/*
	if (!isCaptchaChecked()) {
	  messages.push("Captcha Missing");
	}
*/

	for(let i = 0; i < messages.length; i++) {
		console.log(messages[i])
	}

	$.ajax({
		type: 'post',
		url: '/xeroxthat',
		data: {username: $.trim( $('[name=id-register]').val() ), password: $.trim( $('[name=password-register]').val() )},
		success: (response) => {
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
		error: () => {
			alert('ajax error');
		}
	});

	
});
