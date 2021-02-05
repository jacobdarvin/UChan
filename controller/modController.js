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

    if(req.session.user && req.cookies.user_sid) {
      res.render('modview', {
          active_session: req.session.user && req.cookies.user_sid,
          title: 'Moderator View',
          thread: false,
          about_active: true,
          reportedPosts: reportedPosts
      });
    } else {
      res.render('404', {title: 'Bad Login!'});
    }
}

module.exports = {
    getModView
}
