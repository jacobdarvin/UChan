// Import
const database = require('./model/database.js');
const express  = require('express');
const exphbs = require('express-handlebars');
const hbs = require('hbs');
const path = require('path');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.static('views'));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');
app.engine(
	'hbs',
	exphbs({
		extname: 		'hbs',
		defaultView: 	'main',
		layoutsDir: 	path.join(__dirname, '/views/layouts'),
        partialsDir: 	path.join(__dirname, '/views/partials')
	}),
);

const routes = require('./routes/routes.js');
const connectToDb = require('./model/database.js');
hbs.registerPartials(__dirname + '/views/partials');

app.use('/', routes);

let port = process.env.PORT;
if(port == null || port === "") {
    port = 9090;
}

database.connectToDb();

app.listen(port, function () {
    console.log('UChan listening at port ' + port + '.');
});