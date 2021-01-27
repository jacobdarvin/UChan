const ReportedPost = require('../model/reportedpost.js');

const getModView = async(req ,res) => {

    let reportedPosts = [];
    try {
        reportedPosts = await ReportedPost.find().sort({date: 'desc'})
            .select('_id postNumber board date offTopicCounter lawCounter spamCounter').lean();
    } catch (e) {
        console.log(e);
        res.render('404', {title: '404'});
        return;
    }

    res.render('modview', {
        title: 'Moderator View',
        thread: false,
        about_active: true,
        reportedPosts: reportedPosts
    });
}

module.exports = {
    getModView
}