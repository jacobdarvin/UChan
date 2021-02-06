const ReportedPost = require('../model/reportedpost.js');
const Board = require('../model/board.js');
const RegisterKey = require('../model/registerKey.js');

const sanitize = require('mongo-sanitize');
const userTransactor = require('../helper/user-transactor.js');

const getModView = async (req, res) => {

    if (!(req.session.user && req.cookies.user_sid)) {
        res.render('404', {title: 'Bad Login!'});
        return;
    }

    try {
        var [reportedPosts, activeBoards, unregisteredKeys] = await Promise.all([
            ReportedPost.find().sort({date: 'desc'}).lean(),
            Board.find().select('name').lean(),
            RegisterKey.find().lean()
        ]);
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
        activeBoards: activeBoards,
        unregisteredKeys: unregisteredKeys,

        admin: req.session.rank === 'ADMIN'
    });
};

//TODO: ajax this shit
const generateRegisterKey = async(req, res) => {
    if (!(req.session.user && req.cookies.user_sid)) {
        res.render('404', {title: 'Bad Login!'});
        return;
    }

    if (req.session.rank !== 'ADMIN') {
        res.render('404', {title: 'Invalid moderator access!'});
        return;
    }

    let defaultBoard = sanitize(req.body['default-board']);

    let result = await userTransactor.generateRegisterKey(defaultBoard);
    if (!result.key) {
        res.render('404', {title: 'Error generating register key!'});
        return;
    }
    console.log(result.message);

    res.redirect(req.get('referer'));
}

module.exports = {
    getModView,
    generateRegisterKey
}
