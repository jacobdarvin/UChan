// Import
const express 	 = require('express');
const fs 		     = require('fs');
const hbs 		   = require('hbs');
const mongoose 	 = require('mongoose');
const path 		   = require('path');

// Sessions and Cookies
const cookieParser   = require('cookie-parser');
const bodyParser = require('body-parser');

const app 		  = express();

//Init Cookie and Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Controller Imports
const BoardController = require('../controller/boardController.js');
const IndexController = require('../controller/indexController.js');
const ThreadController = require('../controller/threadController.js');

// DB Constants
const {IMAGE_SIZE_LIMIT} = require('../model/constants.js');

/*
//Init Sessions
app.use(
    session({
        key: 'local_user', //user session id
        secret: 'toptenpspgames',
        resave: true,
        saveUninitialized: true,
        store: database.sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 Day.
        },
    }),
);
*/

/*
app.use((req, res, next) => {
    if (req.cookies.local_user && !req.session.user) {
        res.clearCookie('local_user');
    }
    next();
});
*/

// Multer Image Processing
var multer = require('multer');
var storage = multer.diskStorage({
    destination:  './public/postimgs',
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
}),


upload = multer({ storage: storage, limits: {fileSize: IMAGE_SIZE_LIMIT}, onError: function(err, next) {console.log('jfkld;sajfrrrrr'); next(err)}}).single('postImageInput');

app.get('/', IndexController.getIndex);

/* Static Pages */

app.get('/about', function (req, res) {
	res.render('about', {
		title: 'About',
		thread: false,
    about_active: true,
	});
});

app.get('/rules', function (req, res) {
	res.render('rules', {
		title: 'Rules',
		thread: false,
    rules_active: true,
	});
});


app.get('/thread', function (req, res) {
	res.render('thread', {
		title: 'Thread',
		thread: true,
	});
});


app.get('/:board', BoardController.getBoard);
app.post('/createThread/:board', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            res.render('404', {title: 'Image too large!'});
            return;
        }

        BoardController.createThread(req, res);
    })
});
app.post('/verifyCaptcha', BoardController.validateCaptcha);

app.get('/thread/:postNumber', ThreadController.getThread);
app.post('/replyThread/:postNumber', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            res.render('404', {title: 'Image too large!'});
            return;
        }

        ThreadController.replyThread(req, res);
    });
});
app.post('/deletePost', ThreadController.deletePost);

module.exports = app;
