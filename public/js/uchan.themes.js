let darkMode = localStorage.getItem('darkMode');
let leafMode = localStorage.getItem('leafMode');
let skyMode  = localStorage.getItem('skyMode');
let sunMode = localStorage.getItem('sunMode');
let appleMode = localStorage.getItem("appleMode");

const defaultModeToggle = document.querySelector('#default-mode-toggle');
const darkModeToggle = document.querySelector('#dark-mode-toggle');
const leafModeToggle = document.querySelector('#leaf-mode-toggle');
const skyModeToggle  = document.querySelector('#sky-mode-toggle');
const sunModeToggle = document.querySelector('#sun-mode-toggle');
const appleModeToggle = document.querySelector('#apple-mode-toggle');

//FUNCTIONS
var threadChecker = 0;

$(document).ready(function() {
	if (window.location.href.indexOf("thread") > -1) {
		threadChecker = 1;
 	} else {
 		threadChecker = 0;
	}
});

//DARK MODE

const enableDarkMode = () => {
	document.getElementById('theme').setAttribute('href', '/css/dark-style.css');
	document.getElementById('navbar').classList.remove("navbar-light");
	document.getElementById('navbar').classList.add("navbar-dark");

	if(document.getElementById('logo'))
		document.getElementById('logo').setAttribute('src',  'imgs/icons/logo-dark.png');

	localStorage.setItem('leafMode', null);
	localStorage.setItem('skyMode' , null);
	localStorage.setItem('sunMode', null);
	localStorage.setItem('appleMode', null);

	localStorage.setItem('darkMode', 'enabled');
};

// APPLE MODE
const enableAppleMode = () => {
	document.getElementById('theme').setAttribute('href', '/css/apple-style.css');
	document.getElementById('navbar').classList.remove("navbar-dark");
	document.getElementById('navbar').classList.add("navbar-light");

	if(document.getElementById('logo'))
		document.getElementById('logo').setAttribute('src',  'imgs/icons/logo-apple.png');

	localStorage.setItem('leafMode', null);
	localStorage.setItem('skyMode' , null);
	localStorage.setItem('sunMode', null);
	localStorage.setItem('darkMode', null);

	localStorage.setItem('appleMode', 'enabled');
};

// LEAF MODE

const enableLeafMode = () => {
	document.getElementById('theme').setAttribute('href', '/css/leaf-style.css');
	document.getElementById('navbar').classList.remove("navbar-dark");
	document.getElementById('navbar').classList.add("navbar-light");

	if(document.getElementById('logo'))
		document.getElementById('logo').setAttribute('src',  'imgs/icons/logo-leaf.png');

	localStorage.setItem('darkMode', null);
	localStorage.setItem('skyMode' , null);
	localStorage.setItem('sunMode', null);
	localStorage.setItem('appleMode', null);

	localStorage.setItem('leafMode', 'enabled');
};

// SKY MODE

const enableSkyMode = () => {
	document.getElementById('theme').setAttribute('href', '/css/sky-style.css');
	document.getElementById('navbar').classList.remove("navbar-dark");
	document.getElementById('navbar').classList.add("navbar-light");

	if(document.getElementById('logo'))
		document.getElementById('logo').setAttribute('src',  'imgs/icons/logo-sky.png');

	localStorage.setItem('darkMode', null);
	localStorage.setItem('leafMode', null);
	localStorage.setItem('sunMode', null);
	localStorage.setItem('appleMode', null);

	localStorage.setItem('skyMode' , 'enabled');
};

// SUN MODE
const enableSunMode = () => {
	document.getElementById('theme').setAttribute('href', '/css/sun-style.css');
	document.getElementById('navbar').classList.remove("navbar-dark");
	document.getElementById('navbar').classList.add("navbar-light");

	if(document.getElementById('logo'))
		document.getElementById('logo').setAttribute('src',  'imgs/icons/logo-sun.png'); // NOTE: Change once Yellow UChan logo is created

	localStorage.setItem('darkMode', null);
	localStorage.setItem('leafMode', null);
	localStorage.setItem('skyMode', null);
	localStorage.setItem('appleMode', null);

	localStorage.setItem('sunMode' , 'enabled');
};

// THEMES DISABLER

const disableThemes = () => {
	document.getElementById('theme').setAttribute('href', '/css/style.css');
	document.getElementById('navbar').classList.add("navbar-light");
	document.getElementById('navbar').classList.remove("navbar-dark");

	if(document.getElementById('logo'))
		document.getElementById('logo').setAttribute('src',  'imgs/icons/logo.png');

	localStorage.setItem('darkMode', null);
	localStorage.setItem('leafMode', null);
	localStorage.setItem('skyMode' , null);
	localStorage.setItem('sunMode', null);
	localStorage.setItem('appleMode', null);
};

//FUNCTIONS

if(darkMode === 'enabled') {
	enableDarkMode();
} else if(leafMode === 'enabled') {
	enableLeafMode();
} else if(skyMode === 'enabled') {
	enableSkyMode();
} else if(sunMode === 'enabled'){
	enableSunMode();
} else if(appleMode === 'enabled'){
	enableAppleMode();
} else {
	disableThemes();
}

// EVENT LISTENERS

darkModeToggle.addEventListener('click', () => {
	darkMode = localStorage.getItem('darkMode');
	if(darkMode !== 'enabled') {
		if(threadChecker == 1)
			window.location.reload();

		enableDarkMode();
	} else {
		disableThemes();
	}
});

appleModeToggle.addEventListener('click', () => {
	appleMode = localStorage.getItem('appleMode');
	if(appleMode !== 'enabled') {
		enableAppleMode();
	} else {
		disableThemes();
	}
});

leafModeToggle.addEventListener('click', () => {
	leafMode = localStorage.getItem('leafMode');
	if(leafMode !== 'enabled') {
		enableLeafMode();
	} else {
		disableThemes();
	}
})

skyModeToggle.addEventListener('click', () => {
	skyMode = localStorage.getItem('skyMode');
	if(skyMode !== 'enabled') {
		enableSkyMode();
	} else {
		disableThemes();
	}
})

sunModeToggle.addEventListener('click', () => {
	sunMode = localStorage.getItem('sunMode');
	if(sunMode !== 'enabled') {
		enableSunMode();
	} else {
		disableThemes();
	}
})


defaultModeToggle.addEventListener('click', () => {
	if(threadChecker == 1)
		window.location.reload();
		
	disableThemes();
})

var egg = 0;

function addCounter() {
	egg++;

	console.log(egg);
	if(egg == 6) {
		document.getElementById('logo').setAttribute('src',  'imgs/icons/logo-easter.gif');
	}

	if(egg == 7) {
		document.getElementById('logo-link').setAttribute('href',  '#eggvideo');
		$('#logo-link').append('<br><iframe width="1004" id="eggvideo" height="753" src="https://www.youtube.com/embed/ByrCj6eMMqo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
		$("#logo").css("display", "none");
	}
}
