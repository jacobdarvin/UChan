
//======================================================================
// Imports
//======================================================================

const Board = require('../model/board.js');
const Post = require('../model/post.js');

const dateHelper = require('../helper/dateHelper.js');
const fsHelper = require('../helper/fsHelper.js');
const postTransactor = require('../helper/post-transactor.js');
const sanitize = require('mongo-sanitize');
const { REPLY } = require('../validator/threadValidator.js');


const {ThreadValidator} = require('../validator/threadValidator.js');

//cookies
const uid = require('uid-safe');

//======================================================================
// Controller Functions
//======================================================================

const getThread = async(req, res) => {
    await ThreadValidator.cookieValidation(req, res);
    let postNumber = sanitize(req.params.postNumber);
    let owner = sanitize(req.cookies.local_user);

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
    }

    res.render('thread', {
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

        replies: replies
    });
}

const replyThread = async(req, res) => {
    let isValid =  await ThreadValidator.createPostValidation(req, REPLY);
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
    let parentPostNumber = sanitize(req.params.postNumber);

    let parentPost = await Post.findOne({postNumber: parentPostNumber});
    if (!parentPost) {
        res.render('404', {title: '404'});
        return;
    }

    let reply = new Post({
        text: text,
        name: name,
        type: 'REPLY',
        board: parentPost.board,
        ip: ip,
        parentPost: parentPostNumber,
        ownerCookie: owner
    });
    await reply.save();
    await processQuotes(text, reply.postNumber);

    if (req.file) {
        console.log('hasimage')
        let imageDbName = fsHelper.renameImageAndGetDbName(reply._id, req.file);
        reply.image = imageDbName;
        reply.imageDisplayName = req.file.originalName;
        await reply.save();
    }

    //parent post
    if (!parentPost.uniqueIps.includes(ip)) {
        parentPost.uniqueIps.push(ip);
    }

    if (req.file) {
        parentPost.noOfImages = parentPost.noOfImages + 1;
    }
    parentPost.noOfPosts++;

    let array = [];
    if (parentPost.uniqueIps.length > 1 || parentPost.uniqueIps[0] !== parentPost.ip) {
        parentPost.bump = Date.now();
    }
    await parentPost.save();

    res.redirect(req.get('referer'));

    return;
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
    reportPost
};
