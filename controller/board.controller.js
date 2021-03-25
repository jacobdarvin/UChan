//======================================================================
// Imports
//======================================================================

// Schemas
const Board = require('../model/board.js');
const Post = require('../model/post.js');

// Transactors
const fsHelper = require('../helper/fsHelper.js');
const postTransactor = require('../helper/post-transactor.js');
const sanitize = require('mongo-sanitize');
const userTransactor = require('../helper/user-transactor.js');

//======================================================================
// Controller Functions
//======================================================================

/**
 * Gets and renders a specific board with whatever sorting option given.
 * @author Justin Galura
 * @async
 * 
 * @param {Request} req => the request object. 
 * @param {string} req.params.board => the board to render. 
 * @param {string} req.query.view => how the posts would be displayed (eg. view, catalogue)
 * @param {string} req.query.sort => the sorting parameter. 
 * 
 * @param {Response} res => the response object.
 * 
 */
const getBoard = async(req, res) => {
    await userTransactor.createUserCookie(req, res);
    
    const board = req.params.board;
    const view = req.query['view'];
    const sort = getSort(req.query['sort']);

    const noOfThreadLimit = 20; //for testing
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

/**
 * Creates a thread and redirects to that thread upon successful creation.
 * @async
 * 
 * @param {Request} req => the request.
 * @param {string} req.body.text => the body of the thread being created.
 * @param {string} req.body.name => (optional) the name of the poster.
 * @param {FormData} req.file => the image file of the thread.
 * @param {string} req.body["g-captcha-response"] => the captcha response.
 * @param {string} req.cookies.local_user => the unique id of the owner of the post. 
 * @param {string} req.headers["x-forwarded-for"] => ip address of the user through Heroku.
 * 
 * @param {Response} res => the response. 
 */
const createThread = async(req, res) => {
    await userTransactor.createUserCookie(req, res);

    const text = req.body.text;
    const name = req.body.name;
    const file = req.file;
    const board = req.params.board;
    const captcha = req.body['g-recaptcha-response'];
    const owner = req.cookies.local_user;
    let ip = req.headers["x-forwarded-for"];
    if (ip){
        let list = ip.split(",");
        ip = list[list.length-1];
    } else {
        ip = req.connection.remoteAddress;
    }

    let banned = await userTransactor.checkBan(ip);
    if (banned['result']) {
        //TODO: flesh out front end for ban details
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

//===============================================================
// Inner Functions
//===============================================================

/**
 * Gets the sorting object literal to feed into Mongoose's sort().
 * 
 * @param {string} value => the sorting method.
 * 
 * @return {object} the sorting object literal with the properties of the Schema Board.
 */
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

//TODO: convert to ES6 once TS is implemented.
module.exports = {
    getBoard,
    createThread
};
