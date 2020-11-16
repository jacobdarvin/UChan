// Import
const express 	= require('express');
const fs 		= require('fs');
const hbs 		= require('hbs');
const mongoose 	= require('mongoose');
const path 		= require('path');

const app 		= express();

// controller imports
const BoardController = require('../controller/boardController.js');
const IndexController = require('../controller/indexController.js');
// validators
const ThreadValidator = require('../validator/threadValidator.js');

app.get('/', IndexController.getIndex);

app.get('/board', function (req, res) {
	res.render('board', {
		title: 'Board',
		thread: false,
	});
});

app.get('/about', function (req, res) {
	res.render('about', {
		title: 'About',
		thread: false,
	});
});

app.get('/thread', function (req, res) {
	res.render('thread', {
		title: 'Thread',
		thread: true,
	});
});

app.get('/boards/:board', BoardController.getBoard);

module.exports = app;