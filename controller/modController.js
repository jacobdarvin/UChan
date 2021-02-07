const ReportedPost = require('../model/reportedpost.js');
const Board = require('../model/board.js');
const RegisterKey = require('../model/registerKey.js');
const User = require('../model/user.js');
const BannedIP = require('../model/bannedip.js');

const sanitize = require('mongo-sanitize');
const userTransactor = require('../helper/user-transactor.js');

const getModView = async (req, res) => {

    if (!(req.session.user && req.cookies.user_sid)) {
        res.render('404', {title: 'Bad Login!'});
        return;
    }

    try {
        var [reportedPosts, activeBoards, unregisteredKeys, moderators, bannedips] = await Promise.all([
            ReportedPost.find().sort({date: 'desc'}).lean(),
            Board.find().select('name').lean(),
            RegisterKey.find().lean(),
            User.find({rank: 'MODERATOR'}).lean(),
            BannedIP.find().lean()
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
        moderators: moderators,
        bannedips: bannedips,

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

//TODO: ajax this shit
const banUser = async(req, res) => {
    if (!(req.session.user && req.cookies.user_sid)) {
        res.render('404', {title: 'Bad Login!'});
        return;
    }

    if (req.session.rank !== 'ADMIN') {
        res.render('404', {title: 'Invalid moderator access!'});
        return;
    }

    let postNumber = req.body['ban-post-number'];
    let reason = req.body['ban-reason'];
    let remarks = req.body['ban-remarks'];
    
    let ip;
    try {
        let bannedPost = await ReportedPost.findOne({postNumber: postNumber}).lean();
        if (!bannedPost) {
            res.render('404', {title: 'Post report does not exist.'});
            return;
        }

        ip = bannedPost['ip'];
    } catch (e) {
        console.log(e);
        res.render('404', {title: 'An unexpected error occurred.'});
        return;
    }

    let result = await userTransactor.banIp(ip, null, null, reason, remarks);
    if (!result.result) {
        res.render('404', {title: result.message});
        return;
    }

    res.redirect(req.get('referer'));
}

const deleteModerator = async(req, res) => {
    if (!(req.session.user && req.cookies.user_sid)) {
        res.render('404', {title: 'Bad Login!'});
        return;
    }

    if (req.session.rank !== 'ADMIN') {
        res.render('404', {title: 'Invalid moderator access!'});
        return;
    }

    const username = req.body['username'];

    const result = await userTransactor.deleteModerator(username);
    console.log(result);

    res.send(result);
}

module.exports = {
    getModView,
    generateRegisterKey,
    banUser,
    deleteModerator
}
