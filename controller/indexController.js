
//======================================================================
// Imports
//======================================================================

const Post = require('../model/post.js');

const userTransactor = require('../helper/user-transactor.js');

//======================================================================
// Controller Functions
//======================================================================

/**
 * Invokes the home page containing the 8 most recently bumped threads.
 * 
 * @param {Request} req the request object
 * @param {Response} res the response object
 * 
 * 
 */
const getIndex = async (req, res) => {
    res.redirected('/xeroxthis');
    return;
    await userTransactor.createUserCookie(req, res);

    try {
        const activeThreads = await  Post.find({type: 'THREAD'})
                        .sort({bump: 'desc'})
                        .limit(8)
                        .lean();

        res.render('index', {
            active_session: req.session.user && req.cookies.user_sid,
            title: 'UChan',
            threads: activeThreads,
            home_active: true,
        });
    } catch (e) {
        console.log("Index controller getIndex: " + e);
        //TODO: better error pages
        res.render('404', {title: "Internal error."});
    }
    return;
}

module.exports = {getIndex};
