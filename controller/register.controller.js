
//======================================================================
// Imports
//======================================================================

const userTransactor = require('../helper/user-transactor.js');

//======================================================================
// Exports
//======================================================================

/**
 * Renders the moderator sign-up page. User should not be logged in.
 * @async
 * 
 * @param {Request} req the request object.
 * @param {Response} res the response paper. 
 * 
 */
//TODO: captcha
const getRegister = async (req, res) => {
  if (userTransactor.isModSessionActive(req)) {
    //TODO: Render forbidden access page
    res.render('404', {title: 'Please log out first.'});
    return;
  }

  res.render('xeroxthat', {
    title: 'XeroxThat',
    thread: false,
    about_active: true,
  });
};

/**
 * Sends the sign-up details for moderator creation. User should not
 * be logged in.
 * @async
 * 
 * @param {Request} req the request object
 * @param {Response} res the response object
 * 
 */
const postRegister = async (req, res) => {
  if (userTransactor.isModSessionActive(req)) {
    //TODO: Render forbidden access page
    res.render('404', {title: 'Please log out first.'});
    return;
  }

  const username = req.body['id-register'];
  const password = req.body['password-register'];
  const registerKey = req.body['key-register'];

  //TODO: ajax in the future
  const result = await userTransactor.createUser(username, password, registerKey);

  res.send(result);
}

module.exports = {
  getRegister,
  postRegister
};
