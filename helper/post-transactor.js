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

const createThread = async(text, name, file, board, owner, ip) => {
    if (name.trim() === '') {
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
        return {result: false, message: 'An unexpected error occured while creating the post'};
    }

    return {result: true, message: 'Successfully created new thread.', postNumber: post.postNumber};
}

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

module.exports = {
    createThread,
    reportThread,
    setSticky,
    validateCaptcha
}
