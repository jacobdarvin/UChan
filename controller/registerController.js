const bcrypt = require('bcrypt');
const session = require('express-session');
const userTransactor = require('../helper/user-transactor.js');
const sanitize = require('mongo-sanitize');
var ObjectId = require('mongodb').ObjectID;

const db = require('../model/database.js');

//TODO: verify that user is not logged in and captcha
const getRegister = async (req, res) => {
  res.render('xeroxthat', {
    title: 'XeroxThat',
    thread: false,
    about_active: true,
  });
}

const postRegister = async (req, res) => {
  let username = sanitize(req.body['id-register']);
  let password = sanitize(req.body['password-register']);
  let registerKey = sanitize(req.body['key-register']);

  //TODO: ajax in the future
  let result = await userTransactor.createUser(username, password, registerKey);

  res.send(result);
}

module.exports = {
  getRegister,
  postRegister
};
