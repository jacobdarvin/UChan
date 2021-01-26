// Import
const express 	 = require('express');

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
const LoginController = require('../controller/loginController.js');

// DB Constants
const {IMAGE_SIZE_LIMIT} = require('../model/constants.js');

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

/* Moderator Pages //To move in unique controllers */
app.get('/modview', function (req, res) {
	res.render('modview', {
		title: 'Moderator View',
		thread: false,
    about_active: true,
	});
});

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

/* Dynamic Pages */
app.get('/xeroxthis', LoginController.getLogin);

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

app.put('/reportpost', ThreadController.reportPost);

module.exports = app;
