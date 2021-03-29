/***
 *  Module that is responsible for handling database operations on Posts
 *
 *
 */

//======================================================================
// Imports
//======================================================================

const axios = require('axios').default;
const Post = require('../model/post.js');
const Board = require('../model/board.js');
const ReportedPost = require('../model/reportedpost.js');
const BannedIP = require('../model/bannedip.js');
const User = require('../model/user.js');
const fsHelper = require('../helper/fsHelper.js');

const {THREAD_CHAR_LIMIT, IMAGE_SIZE_LIMIT, NAME_LIMIT } = require('../model/constants.js');

//======================================================================
// Exports
//======================================================================

/*
    Reports a thread. Creates a report if Post ID has not been reported yet, otherwise reports are treated as sets,
    i.e. unique IPs can only report a Post once.
    Reports saves a copy of the text, ip, and (if exists) the file.

    @param postNumber: The post number to be reported
    @param reason: The reason for why the post is being reported.
    @param ip: IP address of the user who sent the report request.

    @return result (boolean): Whether the report operation is successful.
    @return message (String): Message associated with the result.
 */
const reportThread = async(postNumber, reason, ip) => {
    let postToReport;
    try {
        postToReport = await Post.findOne({postNumber: postNumber});
    } catch (error) {
        console.log(error);
        return {result: false, message: 'An unexpected error occured.'};
    }

    if (!postToReport) {
        return {result: false, message: 'Post does not exist.'};
    }

    let reportedPost;
    let isIpBanned;
    try {
        [reportedPost, isIpBanned] = await Promise.all([
            ReportedPost.findOne({postNumber: postNumber}),
            BannedIP.exists({ip: postToReport['ip']})
        ]);

    } catch (error) {
        return {result: false, message: 'An unexpected error occurred.'};
    }

    if (!reportedPost) {
        fsHelper.makeReportCopy(postToReport['image']);

        try {
            reportedPost = new ReportedPost({
                postNumber: postNumber,
                text: postToReport['text'],
                ip: postToReport['ip'],
                file: postToReport['image'],
                board: postToReport['board'],
                date: postToReport['created'],
                banned: isIpBanned
            });
            await reportedPost.save();
        } catch (e) {
            return {result: false, message: 'An unexpected error occurred.'};
        }
    }

    let reportExists = false;
    for (let i = 0; i < reportedPost['reports'].length; i++) {
        if (reportedPost.reports[i].ip === ip) {
            reportExists = true;
            break;
        }
    }

    if (reportExists) {
        return {result: false, message: 'You have already reported this post.'};
    }

    try {
        let report = {
            reason: reason,
            ip: ip
        };

        switch (reason) {
            case 'OFF TOPIC':
                reportedPost.offTopicCounter++;
                break;
            case 'LAW':
                reportedPost.lawCounter++;
                break;
            case 'SPAM':
                reportedPost.spamCounter++;
                break;
            default:
                //defaults to offtopic
                reportedPost.offTopicCounter++;
                break;
        }

        reportedPost['reports'].push(report);
        await reportedPost.save();
    } catch (e) {
        console.log(e);
        return {result: false, message: 'An unexpected error occured.'};
    }

    return {result: true, message: 'Report successfully sent.'};
}

/** 
    Creates a thread. Peforms validation on the fields input by the user (not in sequence):
    
        - Name 
            - if empty, will set to default 'Anonymous'
            - not over character limit
        - Text
            - not empty
            - not over character limit
        - File
            - has an image file
            - does not exceed limit
        - Board
            - if board user is posting to exists
    @async

    @param {string} text: String => body/text of the thread
    @param {string} name: String => name of the user associated with the post
    @param {FormData} file: Object => formdata sent by the user containing the post's image file
    @param {string} board: String => board user is posting to
    @param {string} owner: String => the associated owner (in random hash)
    @param {string} ip: String => ip address of the poster

    @return {boolean} => result of the operation
    @return {string} => message associated with the operation's result
*/
const createThread = async(text, name, file, board, owner, ip) => {
    if (!name || name.trim() === '') {
        name = 'Anonymous';
    }

    try {
        var boardPost = await Board.findOne({name: board});
        if (!boardPost) {
            return {result: false, message: 'Board does not exist.'};
        }
    } catch (e) {
        return {result: false, message: 'An unexpected error occured while checking for the board.'};
    }

    if (text === '') {
        return {result: false, message: 'Text is empty.'};
    }

    if (text > THREAD_CHAR_LIMIT) {
        return {result: false, message: 'Text exceeds limit.'};
    }

    if (name > NAME_LIMIT) {
        return {result: false, message: 'Name exceeds limit.'};
    }

    if (!file) {
        return {result: false, message: 'File required.'};
    }

    if (file.size > IMAGE_SIZE_LIMIT) {
        return {result: false, message: 'File exceeds limit.'};
    }

    try {
        var post = new Post({
            text: text,
            name: name,
            type: 'THREAD',
            board: board,
            ip: ip,
            ownerCookie: owner
        });
        await post.save();

        let imageDbName = fsHelper.renameImageAndGetDbName(post._id, file);
        post.image = imageDbName;
        post.imageDisplayName = file.originalname;
        await post.save();
        
    } catch (e) {
        console.log(e);
        //TODO: delete post upon thread creation error
        return {result: false, message: 'An unexpected error occured while creating the post'};
    }

    return {result: true, message: 'Successfully created new thread.', postNumber: post.postNumber};
};

/**
 * Replies to a thread. Image file is optional. Processes postNumbers (references to other posts) in the body of\
 * the text and updates them accordingly. Bumps the parent post if conditions are met. 
 * @async
 * 
 * @param {number} parentPostNumber the parent post to reply to.
 * @param {text} text body of the reply.
 * @param {text} name name of the poster.
 * @param {FormData} file the image file (optional for reply).
 * @param {string} owner cookie associated with the post for ownership.
 * @param {string} ip ip associated with the post. 
 * 
 * @returns {Transaction} result of the reply transaction. 
 */
const replyToThread = async(parentPostNumber, text, name, file, owner, ip) => {
    if (!name || name.trim() === '') {
        name = 'Anonymous';
    }

    if (!text || text.trim() === '') {
        return {success: false, message: 'Text is empty', result: null};
    }

    if (text > THREAD_CHAR_LIMIT) {
        return {success: false, message: 'Text exceeds character limit.', result: null};
    }

    if (name > NAME_LIMIT) {
        return {success: false, message: 'Name exceeds character limit.', result: null};
    }

    if (file) {
        if (file.size > IMAGE_SIZE_LIMIT) {
            return {success: false, message: 'File exceeds size limit.', result: null};
        }
    }

    try {
        var parentPost = await Post.findOne({postNumber: parentPostNumber});
        if (!parentPost) {
            return {success: false, message: 'Post does not exist.', result: null};
        }
    } catch (e) {
        console.log('Reply to thread error:' + e);
        return {success: false, message: 'An unexpected error occured.', result: null};
    }

    try {
        var reply = new Post({
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
    } catch (e) {
        console.log('Reply to thread error:' + e);
        //TODO: delete reply upon failure
        return {success: false, message: 'An unexpected error occured.', result: null};
    }

    try {
        if (file) {
            let imageDbName = fsHelper.renameImageAndGetDbName(reply._id, file);
            reply.image = imageDbName;
            reply.imageDisplayName = file.originalName;
            await reply.save();
        }
    } catch (e) {
        console.log('Reply to thread error: ' + e);
        //TODO: delete reply failure
        return {success: false, message: 'An unexpected error occured.', result: null};
    }

    if (!parentPost.uniqueIps.includes(ip)) {
        parentPost.uniqueIps.push(ip);
    }

    if (file) {
        parentPost.noOfImages++;
    }
    parentPost.noOfPosts++;

    //bumping condition
    if (parentPost.uniqueIps.length > 1 || parentPost.uniqueIps[0] !== parentPost.ip) {
        parentPost.bump = Date.now();
    }

    try {
        await parentPost.save();
    } catch (e) {
        console.log('Reply to thread error: ' + e);
        //TODO: delete reply failure
        return {success: false, message: 'An unexpected error occured.', result: null};
    }

    return {success: true, message: 'Reply successfully posted.', result: reply};
};

/**
 * Deletes a post and its media file only if the owner parameter passed is the actual 
 * owner of the post. If the post to delete is a thread, it deletes all the replies, 
 * otherwise it deletes the reply from the post. 
 * @async
 * 
 * @param {number} postNumber the post number associated with the post to delete
 * @param {string} owner the owner of the post
 * 
 * @returns {Transaction} the result of the delete operation
 */
const deletePost = async(postNumber, owner) => {
    try {
        var post = await Post.findOne({postNumber: postNumber});
        if (!post) {
            return {success: false, message: 'Post does not exist.', result: null}
        }
    } catch (e) {
        console.log("Delete post error: " + e);
        return {success: false, message: 'An unexpected error occured.', result: null};
    }

    if (post['ownerCookie'] !== owner) {
        return {success: false, message: 'You do not own this post.', result: null};
    }

    let type = post['type'];
    let board = post['board'];

    if (type === 'THREAD') {
        deleteReplies(post['postNumber']);
    } else {
        await deleteReplyFromParentPost(post);
    }

    fsHelper.deletePostImage(post['image']);
    try {
        await post.remove()
    } catch (error) {
        console.log('Delete post error: ' + e);
        return {success: false, message: 'An unexpected error occured.', result: null};
    }

    return {
        success: true,
        message: 'Successfully deleted post.',
        result: {
            type: type,
            board: board
        }
    };
};



/*
    ADMIN/MODERATOR
    Stickies a post. Posts can only be stickied if they're of the type 'THREAD'.
    Only Mmoderators that have power over the post's board can sticky the post.

    @param postNumber: The post number to be stickied.
    @param user: The username requesting the sticky command.
    @param flag: What to set the sticky status

    @return result (boolean): Whether the sticky operation is successful.
    @return message (String): Message associated with the result.
 */
const setSticky = async(postNumber, username, flag) => {
    try {
        let [post, user] = await Promise.all([
            Post.findOne({postNumber: postNumber}),
            User.findOne({name: username})
        ]);

        if (!post) {
            return {result: false, message: 'stickyPost: post does not exist.'};
        }

        if (!user.boards.includes(post.board)) {
            return {result: false, message: 'stickyPost: you do not have moderation powers over this board.'};
        }

        if (post['type'] !== 'THREAD') {
            return {result: false, message: 'stickyPost: post is not a thread.'};
        }

        post['stickied'] = flag;
        await post.save();
    } catch (e) {
        console.log(e);
        return {result: false, message: 'stickyPost: An unexpected error occured.'};
    }

    return {result: true, message: `stickyPost: succesfully set post's sticky to ${flag}`};
}

const validateCaptcha = async(captcha, remoteAddress) => {
    const secretKey = "6Lff6eQZAAAAAENSnF_AMdFRbhpMlEuU5IhD3gFz";
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${remoteAddress}`;

    let response = await axios.get(verifyUrl);
    return response.data.success;
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

/**
 * Deletes all the replies of a post.
 * @async
 * 
 * @param {Post} parentPost the post object to delete
 * 
 */
async function deleteReplies(parentPost) {
    try {
        var replies = await Post.find({parentPost: parentPost})
    } catch (error){
        console.log(error);
        return;
    }

    for (let reply of replies) {
        let image = reply.image;
        fsHelper.deletePostImage(image);

        reply.remove();
    }
}


/**
 * Deletes a reply from the post and updates the parent post accordingly.
 * @async
 * 
 * @param {Post} reply the reply object to delete
 * 
 */
async function deleteReplyFromParentPost(reply) {
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
    createThread,
    replyToThread,
    deletePost,
    reportThread,
    setSticky,
    validateCaptcha
};
