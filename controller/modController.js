const ReportedPost = require('../model/reportedpost.js');

const getModView = async(req ,res) => {

    let reportedPosts = [];
    try {
        reportedPosts = await ReportedPost.find().sort({date: 'desc'}).lean();
    } catch (e) {
        console.log(e);
        res.render('404', {title: '404'});
        return;
    }

    //post no, board, date, postid, comment
    for (let i = 0; i < reportedPosts.length; i++) {

    }

    res.render('modview', {
        title: 'Moderator View',
        thread: false,
        about_active: true,
    });
}

module.exports = {
    getModView
}