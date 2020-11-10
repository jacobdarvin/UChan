// Import
const express 	= require('express');
const fs 		= require('fs');
const hbs 		= require('hbs');
const mongoose 	= require('mongoose');
const path 		= require('path');

const app 		= express();

//controller imports
const BoardController = require('../controller/boardController.js');

app.get('/', function (req, res) {
	res.render('index', {
		title: 'UChan',
	});
});

app.get('/board', function (req, res) {
	res.render('board', {
		title: 'Board',
		thread: false,
	});
});

app.get('/thread', function (req, res) {
	res.render('thread', {
		title: 'Thread',
		thread: true,
	});
});

app.get('/:board', BoardController.getBoard);

module.exports = app;