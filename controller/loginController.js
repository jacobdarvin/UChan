const bcrypt = require('bcrypt');
const session = require('express-session');

const db = require('../model/database.js');
//const Account = require('../model/user.js');

const loginController = {
    getLogin: function (req, res) {
      res.render('xeroxthis', {
    		title: 'XeroxThis',
    		thread: false,
        about_active: true,
    	});
    }
};

module.exports = loginController;
