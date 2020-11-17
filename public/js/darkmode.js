let darkMode = localStorage.getItem('darkMode');
let leafMode = localStorage.getItem('leafMode');
let skyMode  = localStorage.getItem('skyMode');
let sunMode = localStorage.getItem('sunMode');

const defaultModeToggle = document.querySelector('#default-mode-toggle');
const darkModeToggle = document.querySelector('#dark-mode-toggle');
const leafModeToggle = document.querySelector('#leaf-mode-toggle');
const skyModeToggle  = document.querySelector('#sky-mode-toggle');
const sunModeToggle = document.querySelector('#sun-mode-toggle');
//FUNCTIONS

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
	
	localStorage.setItem('darkMode', 'enabled');
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
}else {
	disableThemes();
}

// EVENT LISTENERS

darkModeToggle.addEventListener('click', () => {
	darkMode = localStorage.getItem('darkMode');
	if(darkMode !== 'enabled') {
		enableDarkMode();
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
	disableThemes();
})