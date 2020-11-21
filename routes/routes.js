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

// db constants
const database = require('../model/database.js');

// Multer Image Processing
var multer = require('multer');
var storage = multer.diskStorage({
    destination:  './public/postimgs',
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
}),
upload = multer({ storage: storage, limits: {fileSize: database.IMAGE_SIZE_LIMIT} }).single('postImageInput');

app.get('/', IndexController.getIndex);

/* Static Pages */

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

app.get('/:board', BoardController.getBoard);
app.post('/createThread/:board', upload, BoardController.createThread);
app.post('/verifyCaptcha', BoardController.validateCaptcha);

module.exports = app;