
//======================================================================
// Imports
//======================================================================

// Schemas
const Board = require('../model/board.js');
const Post = require('../model/post.js');
const BannedIP = require('../model/bannedip.js');

// Helpers
const postTransactor = require('../helper/post-transactor.js');
const userTransactor = require('../helper/user-transactor.js');
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
    let sort = getSort(sanitize(req.query['sort']));

    let noOfThreadLimit = 20; //for testing
    let [threads, boardResult] = await Promise.all([

        Post.find({board: board, type: 'THREAD'}).sort(sort).limit(noOfThreadLimit).lean(),

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
    await ThreadValidator.cookieValidation(req, res);

    let text = req.body.text;
    let name = req.body.name;
    let file = req.file;
    let board = req.params.board;
    let captcha = req.body['g-recaptcha-response'];
    let owner = sanitize(req.cookies.local_user);
    let ip = req.headers["x-forwarded-for"];
    if (ip){
        let list = ip.split(",");
        ip = list[list.length-1];
    } else {
        ip = req.connection.remoteAddress;
    }

    let banned = userTransactor.checkBan(ip);
    if (banned['result']) {
        res.render('banned', {title: 'You are banned', reason: banned['details']});
        return;
    }

    let captchaValid = await postTransactor.validateCaptcha(captcha, ip);
    if (!captchaValid) {
        fsHelper.fs.unlink(req.file.path, f => {});
        //TODO: ajax send if js
        res.render('404', {title: 'Invalid captcha.'});
        return;
    }

    let response = await postTransactor.createThread(text, name, file, board, owner, ip);
    if (!response.result) {
        //TODO: ajax send if js
        fsHelper.fs.unlink(req.file.path, f => {});
        res.render('404', {title: response.message});
        return;
    }

    //TODO bumping algo

    res.redirect(`/thread/${response.postNumber}`);
};

const validateCaptcha = async(req, res) => {
    let captchaResult = await ThreadValidator.captchaValidation(req.body.captcha);
    res.send(captchaResult);
    return;
};

//===============================================================
// Inner Functions
//===============================================================

function getSort(value) {
    switch (value) {
        case 'most_active':
            return {stickied: 'desc', bump: 'desc'};
        case 'newest':
            return {stickied: 'desc', created: 'desc' };
        case 'oldest':
            return {stickied: 'desc', created: 'asc'};
        case 'most_replies':
            return {stickied: 'desc', noOfPosts: 'desc'};
        default:
            return {stickied: 'desc', bump: 'desc'};
    }
}

module.exports = {
    getBoard,
    createThread,
    validateCaptcha
};
