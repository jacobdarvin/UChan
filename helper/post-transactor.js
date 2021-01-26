/***
 *  Module that is responsible for handling database operations on Posts
 *
 *
 */

//======================================================================
// Imports
//======================================================================

const Post = require('../model/post.js');
const ReportedPost = require('../model/reportedpost.js');
const fsHelper = require('../helper/fsHelper.js');

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
    try {
        reportedPost = await ReportedPost.findOne({postNumber: postNumber});
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
                file: postToReport['image']
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

        reportedPost['reports'].push(report);
        await reportedPost.save();
    } catch (e) {
        console.log(e);
        return {result: false, message: 'An unexpected error occured.'};
    }

    return {result: true, message: 'Report successfully sent.'};
}

module.exports = {
    reportThread
}
