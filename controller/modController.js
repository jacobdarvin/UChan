const ReportedPost = require('../model/reportedpost.js');
const Board = require('../model/board.js');
const getModView = async(req ,res) => {

    if (!(req.session.user && req.cookies.user_sid)) {
        res.render('404', {title: 'Bad Login!'});
    }


    /*
    try {
        var [reportedPosts, activeBoards] = await Promise.all([
            ReportedPost.find().sort({date: 'desc'}).lean(),

        ])
    }*/

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
        mod_active: true,
        boards: req.session.boards,
        active_session: req.session.user && req.cookies.user_sid,
        title: 'Moderator View',
        thread: false,
        reportedPosts: reportedPosts,
        active_boards: true
    });
}

module.exports = {
    getModView
}
