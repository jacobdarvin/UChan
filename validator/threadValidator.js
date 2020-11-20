/* Limits and Sanitation */
const {THREAD_CHAR_LIMIT, IMAGE_SIZE_LIMIT, NAME_LIMIT } = require('../model/constants.js');
const sanitize = require('mongo-sanitize');

/* Mongoose Schemas */
const Board = require('../model/board.js');
const { exists } = require('../model/board.js');

/* Others */
const axios = require('axios').default;
const fs = require('fs');

var errorsArr = [];

const ThreadValidator = {
    createThreadValidation: async function(req) {
        

        console.log(THREAD_CHAR_LIMIT)
        console.log(IMAGE_SIZE_LIMIT)
        console.log(NAME_LIMIT)
        
        let captcha = req.body['g-recaptcha-response']
        if (captcha=== undefined || captcha === '' || captcha === null) {
            //console.error('Captcha test missing or failed.')
            if (req.file) {
                fs.unlink(req.file.path, f => {});
            }

            errorsArr[0] = 'Captcha test missing or failed.';
        }
        
        const secretKey = "6Lff6eQZAAAAAENSnF_AMdFRbhpMlEuU5IhD3gFz";
        const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;
        let response = await axios.get(verifyUrl);
        if (!response.data.success) {
            //console.error("Captcha failed.");

            if (req.file) {
                fs.unlink(req.file.path, f => {});
            }

            errorsArr[0] = 'Captcha test failed.';
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
            //console.error("Board user is posting to does not exist.");
            //return false;
        }

        if (text == '') {
            //console.error("Text is empty.");
            errorsArr[1] = 'Text is empty.';
        }

        if (text > THREAD_CHAR_LIMIT) {
            //console.error("Text exceeds limit.");
            alert('Nice try buddy.');
            errorsArr[1] = 'Text exceeds limit.';
        }

        if (name > NAME_LIMIT) {
            //console.error("Name exceeds limit.");
            alert('Nice try buddy.');
            errorsArr[2] = "Name exceeds limit.";
        }

        if (file) {
            if (file.size > IMAGE_SIZE_LIMIT) {
                //console.error("File exceeds limit.");
                errorsArr[3] = "File exceeds limit."
            }
        }

        return errorsArr;
    },

    captchaValidation: async function(captcha) {
        const secretKey = "6Lff6eQZAAAAAENSnF_AMdFRbhpMlEuU5IhD3gFz";
        const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;

        let response = await axios.get(verifyUrl);
        if (!response.data.success) {
            //console.error("Captcha failed.");
            errorsArr[0] = "Captcha failed.";
        }
        return errorsArr;
    }
}

module.exports = ThreadValidator;