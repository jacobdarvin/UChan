
//======================================================================
// Imports
//======================================================================

const Post = require('../model/post.js');

const {ThreadValidator} = require('../validator/threadValidator.js');

//======================================================================
// Controller Functions
//======================================================================

const getIndex = async (req, res) => {
    await ThreadValidator.cookieValidation(req, res);

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
