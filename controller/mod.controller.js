//======================================================================
// Imports
//======================================================================

const ReportedPost = require('../model/reportedpost.js');
const Board = require('../model/board.js');
const RegisterKey = require('../model/registerKey.js');
const User = require('../model/user.js');
const BannedIP = require('../model/bannedip.js');
const userTransactor = require('../helper/user-transactor.js');

//======================================================================
// Exports
//======================================================================

/**
 * Renders the mod dashboard.
 * @async
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
const getModView = async(req, res) => {
    if(!userTransactor.isModSessionActive(req)) {
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

/**
 * Generates a register key for moderator sign-up with
 *  one default board. Only admins can generate keys.
 * @async
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
//TODO: ajax this shit
const generateRegisterKey = async(req, res) => {
    if(!userTransactor.isModSessionActive(req)) {
        res.render('404', {title: 'Bad Login!'});
        return;
    }

    if (req.session.rank !== 'ADMIN') {
        res.render('404', {title: 'Invalid moderator access!'});
        return;
    }

    let defaultBoard = req.body['default-board'];

    let result = await userTransactor.generateRegisterKey(defaultBoard);
    if (!result.key) {
        res.render('404', {title: 'Error generating register key!'});
        return;
    }
    
    res.redirect(req.get('referer'));
}

/**
 * Bans the a user associated with a reported post. Admin access only.
 * @async
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
//TODO: ajax this shit
const banUser = async(req, res) => {
    if(!userTransactor.isModSessionActive(req)) {
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

    //Two parameters are null currently for start and end date
    let result = await userTransactor.banIp(ip, null, null, reason, remarks);
    if (!result.result) {
        res.render('404', {title: result.message});
        return;
    }

    res.redirect(req.get('referer'));
}
/**
 * Unbans a user. Admin only.
 * @async
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
//TODO: ajax this shit
const unbanUser = async(req, res) => {
    if(!userTransactor.isModSessionActive(req)) {
        res.render('404', {title: 'Bad Login!'});
        return;
    }

    if (req.session.rank !== 'ADMIN') {
        res.render('404', {title: 'Invalid moderator access!'});
        return;
    }

    const ip = req.body['ipToBanPlacement'];
    const result = await userTransactor.unbanIp(ip);
    if (!result.result) {
        res.render('404', {title: 'Ip ban does not exist.'});
    }

    res.redirect(req.get('referer'));
}

/**
 * Deletes a moderator from the mod roster. Admin only. 
 * @async
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
const deleteModerator = async(req, res) => {
    if(!userTransactor.isModSessionActive(req)) {
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

/**
 * Revokes mode authority on selected board/s for a moderator. Admin only. 
 * @async
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
const removeBoardsFromModerator = async(req, res) => {
    if(!userTransactor.isModSessionActive(req)) {
        res.render('404', {title: 'Bad Login!'});
        return;
    }

    if (req.session.rank !== 'ADMIN') {
        res.render('404', {title: 'Invalid moderator access!'});
        return;
    }

    const boardsToRemove = req.body['boards'];
    const username = req.body['username'];
    const result = await userTransactor.removeBoards(username, boardsToRemove);

    res.send(result);
}

/**
 * Grants auhtority for a moderator over a board. Admin only.
 * @async
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
const addBoardToModerator = async(req, res) => {
    if(!userTransactor.isModSessionActive(req)) {
        res.render('404', {title: 'Bad Login!'});
        return;
    }

    if (req.session.rank !== 'ADMIN') {
        res.render('404', {title: 'Invalid moderator access!'});
        return;
    }

    const board = req.body['board'];
    const username = req.body['username'];
    const result = await userTransactor.addBoard(username, board);

    res.send(result);
}

/**
 * Requests for the report details of a certain post. 
 * @async
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
const getReportDetails = async(req, res) => {
    if(!userTransactor.isModSessionActive(req)) {
        res.render('404', {title: 'Bad Login!'});
        return;
    }

    const postNumber = req.query['postNumber'];
    let details = await ReportedPost.findOne({postNumber: postNumber}).select('text file').lean();
    if (!details) {
        res.send({text: 'REPORT HAS BEEN DELETED', file: ''});
        return;
    }

    res.send(details);
}

module.exports = {
    getModView,
    generateRegisterKey,
    banUser,
    deleteModerator,
    removeBoardsFromModerator,
    addBoardToModerator,
    unbanUser,
    getReportDetails
}
