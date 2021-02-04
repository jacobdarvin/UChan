const bcrypt = require('bcrypt');
const session = require('express-session');

const db = require('../model/database.js');

const registerController = {
    getRegister: function (req, res) {
      res.render('xeroxthat', {
    		title: 'XeroxThat',
    		thread: false,
        about_active: true,
    	});
    }
};

module.exports = registerController;
