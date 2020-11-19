/* Limits and Sanitation */
const {THREAD_CHAR_LIMIT, IMAGE_SIZE_LIMIT, NAME_LIMIT } = require('../model/database.js');
const sanitize = require('mongo-sanitize');

/* Mongoose Schemas */
const Board = require('../model/board.js');
const { exists } = require('../model/board.js');

/* Others */
const axios = require('axios').default;
const fs = require('fs');

const ThreadValidator = {

    createThreadValidation: async function(req) {
        
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

        req.params.board = sanitize(req.params.board.trim());
        let board = req.params.board;

        req.body.text = sanitize(req.body.text.trim());
        let text = req.body.text;

        req.body.name = sanitize(req.body.name.trim());
        let name = req.body.name;

        let file = req.file;
        
        /* Board Validation */
        let boardExists = await Board.exists({name: board});
        if (!exists) {
            console.error("Board user is posting to does not exist.");
            return false;
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

module.exports = ThreadValidator;