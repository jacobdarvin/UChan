let darkMode = localStorage.getItem('darkMode');
let leafMode = localStorage.getItem('leafMode');

const darkModeToggle = document.querySelector('#dark-mode-toggle');
const leafModeToggle = document.querySelector('#leaf-mode-toggle');

//FUNCTIONS

//DARK MODE

const enableDarkMode = () => {
	document.getElementById('theme').setAttribute('href', '/css/dark-style.css');
	document.getElementById('navbar').classList.remove("navbar-light");
	document.getElementById('navbar').classList.add("navbar-dark");

	if(document.getElementById('logo'))
		document.getElementById('logo').setAttribute('src',  'imgs/icons/logo-dark.png');

	localStorage.setItem('leafMode', null);
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
	localStorage.setItem('leafMode', 'enabled');
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
};

//FUNCTIONS

if(darkMode === 'enabled') {
	enableDarkMode();
} else if(leafMode === 'enabled') {
	enableLeafMode();
} else {
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