/* Limits and Sanitation */
const {THREAD_CHAR_LIMIT, IMAGE_SIZE_LIMIT, NAME_LIMIT } = require('../model/constants.js');
const sanitize = require('mongo-sanitize');

/* Mongoose Schemas */
const Board = require('../model/board.js');
const Post = require('../model/post.js');
const { exists } = require('../model/board.js');

/* Others */
const axios = require('axios').default;
const fs = require('fs');

const THREAD = 0;
const REPLY = 1;

const ThreadValidator = {

    createPostValidation: async function(req, type) {
        
        let captcha = req.body['g-recaptcha-response']
        if (captcha=== undefined || captcha === '' || captcha === null) {
            console.error('Captcha test missing or failed.')
            if (req.file) {
                fs.unlink(req.file.path, f => {});
            }
            return false;
        }
        
        const secretKey = "6Lff6eQZAAAAAENSnF_AMdFRbhpMlEuU5IhD3gFz";
        const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;
        let response = await axios.get(verifyUrl);
        if (!response.data.success) {
            console.error("Captcha failed.");

            if (req.file) {
                fs.unlink(req.file.path, f => {});
            }

            return false;
        }

        req.body.text = sanitize(req.body.text.trim());
        let text = req.body.text;

        req.body.name = sanitize(req.body.name.trim());
        let name = req.body.name;
        if (name == "") {
            req.body.name = 'Anonymous';
        }

        let file = req.file;
        
        if (type == THREAD) {
            req.params.board = sanitize(req.params.board.trim());
            let board = req.params.board;

            let boardExists = await Board.exists({name: board});
            if (!boardExists) {
                console.error("Board user is posting to does not exist.");
                return false;
            }
        } else if (type == REPLY) {
            req.params.postNumber = sanitize(req.params.postNumber.trim());
            let postNumber = req.params.postNumber;

            let postExists = await Post.exists({postNumber: postNumber, type: 'THREAD'});
            if (!postExists) {
                console.error("Post user is replying to does not exist.");
                return false;
            }
        }
       

        if (text == '') {
            console.error("Text is empty.");
            return false;
        }

        if (text > THREAD_CHAR_LIMIT) {
            console.error("Text exceeds limit.");
            return false;
        }

        if (name > NAME_LIMIT) {
            console.error("Name exceeds limit.");
            return false;
        }

        if (type == THREAD) {
            if (!file) {
                console.error("File required.");
                return false;
            }
        }

        if (file) {
            if (file.size > IMAGE_SIZE_LIMIT) {
                console.error("File exceeds limit.");
                return false;
            }
        }

        return true;
    },

    captchaValidation: async function(captcha) {
        const secretKey = "6Lff6eQZAAAAAENSnF_AMdFRbhpMlEuU5IhD3gFz";
        const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;

        let response = await axios.get(verifyUrl);
        if (!response.data.success) {
            console.error("Captcha failed.");
            return false;
        }
        return true;
    }
}

module.exports = {ThreadValidator, THREAD, REPLY};