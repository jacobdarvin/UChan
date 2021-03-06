
//======================================================================
// Imports
//======================================================================

const Post = require('../model/post.js');

const userTransactor = require('../helper/user-transactor.js');

//======================================================================
// Controller Functions
//======================================================================

//TODO: cleanup => replace ThreadValidator dependency
const getIndex = async (req, res) => {
    await userTransactor.createUserCookie(req, res);

    let threads = await  Post.find({type: 'THREAD'})
                    .sort({bump: 'desc'})
                    .limit(8)
                    .lean();

    res.render('index', {
        active_session: req.session.user && req.cookies.user_sid,
        title: 'UChan',
        threads: threads,
        home_active: true,
    });

    return;
}

module.exports = {getIndex};
