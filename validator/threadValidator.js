/* Express-Validator */
const {body, params, validationResult} = require('express-validator');

/* Limits and Sanitation */
const {THREAD_CHAR_LIMIT, IMAGE_SIZE_LIMIT, NAME_LIMIT } = require('../model/database.js');
const sanitize = require('mongo-sanitize');

/* Mongoose Schemas */
const Board = require('../model/board.js');

const ThreadValidator = {

    createThreadValidation: function() {
        var validation = [

            /* Check that the board the user is posting to exists */
            params('board').custom(value => {
                return Board.findOne({name: value}).exec((err, result) => {
                    if (!result) {
                        return Promise.reject('Board user is posting to does not exist.');
                    }
                });
            }),

            /* Text validation */
            body('text').trim(),

            body('text').customSanitizer(value => {
                return sanitize(value);
            }),

            body('text', "Text should not be empty.")
            .notEmpty(),

            body('text', `Text should be within ${THREAD_CHAR_LIMIT} characters.`)
            .isLength({max: THREAD_CHAR_LIMIT}),

            /* Name Validation */
            body('name').trim(),

            body('name').customSanitizer(value => {
                return sanitize(value);
            }),

            body('name', 'Name exceeds limit.')
            .isLength({max: NAME_LIMIT}),


            /* Image Validation */
            body('image').custom(value => {
                if (!value) {
                    return true;
                }

                if (value.size > IMAGE_SIZE_LIMIT) {
                    throw new Error('Image should not be larger than 2MB!');
                }
                
                return true;
            })
        ];

        return validation;
    }
}

module.exports = ThreadValidator;