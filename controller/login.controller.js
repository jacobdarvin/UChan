//======================================================================
// Imports
//======================================================================

const userTransactor = require('../helper/user-transactor.js');

//======================================================================
// Exports
//======================================================================

/**
 * Renders the moderator/admin login page.
 * 
 * @param {Requesst} req request object
 * @param {Resoponse} res response object
 */
const getLogin = async(req, res) => {
    res.render('xeroxthis', {
        title: 'XeroxThis',
        thread: false,
        about_active: true
    });
};

/**
 * Starts the login operation and assigns the necessary session credentials upon
 * successful validation.
 * 
 * @param {Request} req request object
 * @param {Response} res response object
 */
const postLogin = async(req, res) => {
    const username = req.body['id-login'];
    const password = req.body['password-login'];

    const loginTransaction = await userTransactor.login(username, password);
    if (!loginTransaction.success) {
        //TODO: ajax
        //res.send(loginTransaction);
        res.render('xeroxthis', {
            title: 'XeroxThis',
            invalid: true
        });

        return;
    }

    req.session.user = loginTransaction.result.name;
    req.session.rank = loginTransaction.result.rank;
    req.session.boards = loginTransaction.result.boards;

    res.redirect('/modview');
};

module.exports = {
    getLogin,
    postLogin
}

