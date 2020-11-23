let darkModeA = localStorage.getItem('darkMode');
let leafModeA = localStorage.getItem('leafMode');
let skyModeA  = localStorage.getItem('skyMode');
let sunModeA  = localStorage.getItem('sunMode');

if(darkModeA === 'enabled') {
	document.getElementById('theme').setAttribute('href', '/css/dark-style.css');
} else if(leafModeA === 'enabled') {
	document.getElementById('theme').setAttribute('href', '/css/leaf-style.css');
} else if(skyModeA === 'enabled') {
	document.getElementById('theme').setAttribute('href', '/css/sky-style.css');
} else if(sunModeA === 'enabled'){
	document.getElementById('theme').setAttribute('href', '/css/sun-style.css');
}else {
	document.getElementById('theme').setAttribute('href', '/css/style.css');
}
