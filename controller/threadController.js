
//======================================================================
// Imports
//======================================================================

const Board = require('../model/board.js');
const Post = require('../model/post.js');

const dateHelper = require('../helper/dateHelper.js');
const fsHelper = require('../helper/fsHelper.js');
const postTransactor = require('../helper/post-transactor.js');
const userTransactor = require('../helper/user-transactor.js');
const sanitize = require('mongo-sanitize');

const {ThreadValidator} = require('../validator/threadValidator.js');


//======================================================================
// Controller Functions
//======================================================================

/**
 * Renders a thread. 
 * @async
 * 
 * @param {Request} req the request object.
 * @param {Response} res the response object.
 * 
 */
const getThread = async(req, res) => {
    await userTransactor.createUserCookie(req, res);

    const postNumber = req.params['postNumber'];
    const owner = req.cookies['local_user'];

    let [thread, replies] = await Promise.all([

        Post.findOne({postNumber: postNumber, type: 'THREAD'}).lean(),

        Post.find({parentPost: postNumber, type: 'REPLY'})
                .sort({created: 'asc'})
                .lean()

    ]).catch(error => {
        console.log(error);
        res.render('404', {title: 'An error occured!'});
        return;
    });

    if (!thread) {
        res.render('404', {title: 'Thread not found!'});
        return;
    }

    try {
        var board = await Board.findOne({name: thread.board}).select('displayName').lean();
    } catch (err) {
        console.log(error);
        res.render('404', {title: 'An error occured!'});
        return;
    }

    thread.created = dateHelper.formatDate(thread.created);
    for (let i = 0; i < replies.length; i++) {
        replies[i].created = dateHelper.formatDate(replies[i].created);
        replies[i].isOwner = owner === replies[i].ownerCookie;

        //Moderator access
        replies[i].mod_access = (req.session.user && req.cookies.user_sid) && req.session.boards.includes(thread.board); //BEING CALLED
        replies[i].stickied = thread.stickied; //check if parent post is stickied
    }

    res.render('thread', {
        active_session: req.session.user && req.cookies.user_sid,
        mod_access: (req.session.user && req.cookies.user_sid) && (req.session.boards.includes(thread.board)),
        title: board.displayName + ' - ' + thread.text,
        postNumber: thread.postNumber,
        displayName: board.displayName,
        boardName:   thread.board, //PENIS

        action: `/replyThread/${thread.postNumber}`,

        image: thread.image,
        name: thread.name,
        created: thread.created,
        text: thread.text,
        nofOfPosts: thread.nofOfPosts,
        noOfImages: thread.noOfImages,
        uniqueIps: thread.uniqueIps,
        quotes: thread.quotes,
        imageDisplayName: thread.imageDisplayName,
        isOwner: owner === thread.ownerCookie,
        stickied: thread.stickied,

        replies: replies
    });
};
/**
 * Replies to a thread.
 * @async
 * 
 * @param {Request} req the request.
 * @param {Response} res the response. 
 * 
 */
const replyThread = async(req, res) => {
    await userTransactor.createUserCookie(req, res);

    const owner = req.cookies['local_user'];
    const text = req.body['text'];
    const name = req.body['name'];
    const captcha = req.body['g-recaptcha-response'];
    const file = req.file;
    const parentPostNumber = req.params['postNumber'];
    let ip = req.headers["x-forwarded-for"];
    if (ip){
        let list = ip.split(",");
        ip = list[list.length-1];
    } else {
        ip = req.connection.remoteAddress;
    }

    const banned = await userTransactor.checkBan(ip);
    if (banned['result']) {
        res.render('banned', {title: 'You are banned', reason: banned['details']});
        return;
    }

    const captchaValid = await postTransactor.validateCaptcha(captcha, ip);
    if (!captchaValid) {
        fsHelper.fs.unlink(req.file.path, f => {});
        //TODO: ajax send if js
        res.render('404', {title: 'Invalid captcha.'});
        return;
    }

    const replyTransaction = await postTransactor.replyToThread(parentPostNumber, text, name, 
        file, owner, ip);
    
    //TODO: ajax send
    //res.send(replyTransaction)
    if (!replyTransaction.success) {
        res.render('404', {title: '404'});
    }    

    res.redirect(req.get('referer'));
}

const deletePost = async(req, res) => {
    await ThreadValidator.cookieValidation(req, res);

    let postNumber = sanitize(req.body.postNumber);
    try {
        var post = await Post.findOne({postNumber: postNumber})
        console.log(post);
    } catch (error) {
        console.log(error);
        res.render('404', {title: 'An error occured!'});
        return;
    }

    if (!post) {
        res.render('404', {title: 'An error occured!'});
        return;
    }

    let type = post.type;
    let board = post.board;

    if (type === 'THREAD') {
        deleteReplies(post.postNumber);
    } else if (type === 'REPLY') {
        await updateParentPost(post);
    }

    fsHelper.deletePostImage(post.image);
    try {
        await post.remove();
    } catch (error) {
        console.log(error);
        res.render('404', {title: 'An error occured!'});
        return;
    }

    if (type === 'THREAD') {
        res.redirect(`/${board}`);
    } else if (type === 'REPLY') {
        res.redirect(req.get('referer'))
    }

}

const reportPost = async(req, res) => {
    let ip = req.headers["x-forwarded-for"];
    if (ip){
        let list = ip.split(",");
        ip = list[list.length-1];
    } else {
        ip = req.connection.remoteAddress;
    }

    let captchaResult = await ThreadValidator.captchaValidation(req.body['g-recaptcha-response'], ip);
    if (!captchaResult) {
        res.send({result: false, message: 'Captcha failed'});
        return;
    }

    let id = sanitize(req.body['id']);
    let reason = sanitize(req.body['reason']);

    let result = await postTransactor.reportThread(id, reason, ip);

    res.send(result);
}

//TODO: ajax this shit
const stickyPost = async(req, res) => {
    if (!(req.session.user && req.cookies.user_sid)) {
        res.render('404', {title: 'Cannot sticky post as a non-moderator.'});
        return;
    }

    let postNumber = sanitize(req.body['stickyId']);
    let result = await postTransactor.setSticky(postNumber, req.session.user, true);
    if (!result) {
        res.render('404', {title: result.message});
        return;
    }

    res.redirect(req.get('referer'));
};

//TODO: ajax this shit
const unstickyPost = async(req, res) => {
    if (!(req.session.user && req.cookies.user_sid)) {
        res.render('404', {title: 'Cannot unsticky post as a non-moderator.'});
        return;
    }

    let postNumber = sanitize(req.body['stickyId']);
    let result = await postTransactor.setSticky(postNumber, req.session.user,false);
    if (!result) {
        res.render('404', {title: result.message});
        return;
    }

    res.redirect(req.get('referer'));
};

//======================================================================
// Inner Functions
//======================================================================

async function processQuotes(text, postNumber) {
    //TODO: change to @
    let matches = text.match(/[@][\d]{7}/gm);
    if (!matches) {
        return;
    }
    let quotes = new Set();

    for (let i = 0; i < matches.length; i++) {
        var str = matches[i],
        delimiter = '@',
        start = 1,
        tokens = str.split(delimiter).slice(start),
        result = tokens.join(delimiter);

        quotes.add(parseInt(result));
    }

    // TODO: Stack overflow for more efficienct updating
    let promises = new Array();
    for (let item of quotes) {
        let promise = Post.updateOne({postNumber: item}, {$addToSet: {quotes: postNumber}});
        promises.push(promise);
    }

    await Promise.all(promises);
}

async function deleteReplies(parentPost) {
    try {
        var replies = await Post.find({parentPost: parentPost})
    } catch (error){
        console.log(error);
        return;
    }

    console.log(replies)
    for (let reply of replies) {
        let image = reply.image;
        fsHelper.deletePostImage(image);

        reply.remove();
    }
}

async function updateParentPost(reply) {
    try {
        var post = await Post.findOne({postNumber: reply.parentPost});
    } catch (error) {
        console.log(error);
        return;
    }

    let subtrahend = 0;
    if (reply.image !== 'undefined' && reply.image !== "" && reply.image !== undefined) {
        subtrahend = 1;
    }

    post.noOfImages = post.noOfImages - subtrahend;
    post.noOfPosts--;
    await post.save();
    return;
}

module.exports = {
    getThread,
    replyThread,
    deletePost,
    reportPost,
    stickyPost,
    unstickyPost,
};
