
//======================================================================
// Imports
//======================================================================

// Schemas
const Board = require('../model/board.js');
const Post = require('../model/post.js');

// Helpers
const fsHelper = require('../helper/fsHelper.js');
const sanitize = require('mongo-sanitize');

// Validators
const {ThreadValidator} = require('../validator/threadValidator.js');
const { THREAD } = require('../validator/threadValidator.js');

// Cookies
const uid = require('uid-safe');

//======================================================================
// Controller Functions
//======================================================================

const getBoard = async(req, res) => {
    await ThreadValidator.cookieValidation(req, res);
    let board = sanitize(req.params.board);
    let view = sanitize(req.query['view']);

    let noOfThreadLimit = 20; //for testing
    let [threads, boardResult] = await Promise.all([

        Post.find({board: board, type: 'THREAD'}).sort({stickied: 'desc', bump: 'desc'}).limit(noOfThreadLimit).lean(),

        Board.findOne({name: board}).select('displayName')

    ]).catch(error => {
        res.render('404', {
            title: 'An error occured!'
        });
        console.log(error);
        return;
    })

    if (!boardResult) {
        res.render('404', {
            title: 'Board not found!'
        });
        return;
    }

    res.render('board', {
        active_session: req.session.user && req.cookies.user_sid,
        mod_access: (req.session.user && req.cookies.user_sid) && (req.session.boards.includes(board)),
        title:        boardResult.displayName,
        displayName:  boardResult.displayName,

        threads:      threads,
        boardName:    board, //PENIS
        action:       `/createThread/${board}`,

        list: view === 'list'
    });
};

const createThread = async(req, res) => {
    let isValid =  await ThreadValidator.createPostValidation(req, THREAD);
    if (!isValid) {
        res.render('404', {title: '404'});
        return;
    }

    await ThreadValidator.cookieValidation(req, res);

    let owner = sanitize(req.cookies.local_user);

    let ip = req.headers["x-forwarded-for"];
    if (ip){
        let list = ip.split(",");
        ip = list[list.length-1];
    } else {
        ip = req.connection.remoteAddress;
    }

    let text = sanitize(req.body.text);
    let name = sanitize(req.body.name);
    let file = sanitize(req.file);
    let board = sanitize(req.params.board);

    let post = new Post({
        text: text,
        name: name,
        type: 'THREAD',
        board: board,
        ip: ip,
        ownerCookie: owner
    });
    await post.save();

    if (req.file) {
        let imageDbName = fsHelper.renameImageAndGetDbName(post._id, req.file);
        post.image = imageDbName;
        post.imageDisplayName = req.file.originalName;
        await post.save();
    }

    //TODO bumping algo

    //TODO: change to res.redirect when thread is hooked up
    res.redirect(`/thread/${post.postNumber}`);
};

const validateCaptcha = async(req, res) => {
    let captchaResult = await ThreadValidator.captchaValidation(req.body.captcha);
    res.send(captchaResult);
    return;
};

module.exports = {
    getBoard,
    createThread,
    validateCaptcha
};
