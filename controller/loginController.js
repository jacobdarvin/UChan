const bcrypt = require('bcrypt');
const session = require('express-session');
const db = require('../model/database.js');
const sanitize = require('mongo-sanitize');

const User = require('../model/user.js');

const loginController = {
    getLogin: function (req, res) {
      res.render('xeroxthis', {
    		title: 'XeroxThis',
    		thread: false,
        about_active: true,
    	});
    },

    postLogin: async function(req, res) {
      let username = sanitize(req.body['id-login']);
      let password = sanitize(req.body['password-login']);

      let user = await User.findOne({ name: username });

        if(user) {
          bcrypt.compare(password, user.password, function (err,equal) {
            if(equal) {
              console.log("CORRECT")
              req.session.user  = user.name;
              req.session.rank  = user.rank;
              req.session.boards = user.boards;

              res.redirect('/modview');
            } else {
              console.log("WRONG PASS")
              res.render('xeroxthis', {
                title: 'XeroxThis',
            		thread: false,
                about_active: true,
              });
            }
          });
        } else {
          console.log("WRONG USER")
          res.render('xeroxthis', {
            title: 'XeroxThis',
        		thread: false,
            about_active: true,
          });
        }
    }
};

module.exports = loginController;
