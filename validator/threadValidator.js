/* Express-Validator */
const {body, param, validationResult} = require('express-validator');

/* Limits and Sanitation */
const {THREAD_CHAR_LIMIT, IMAGE_SIZE_LIMIT, NAME_LIMIT } = require('../model/database.js');
const sanitize = require('mongo-sanitize');

/* Mongoose Schemas */
const Board = require('../model/board.js');

const ThreadValidator = {

    createThreadValidation: function() {
        console.log('validation 2')
        var validation = [

            /* Check that the board the user is posting to exists */
            param('board').custom(value => {
                return Board.findOne({name: value}).then(result => {
                    if (!result) {
                        return Promise.reject('Board user is posting to does not exist.');
                    }
                    return true;
                });
            }),

            /* Text validation */
            body('text')
                .trim()
                .customSanitizer(value => {
                    return sanitize(value);
                }),

            body('text')
                .notEmpty().withMessage("Text should not be empty.")
                .isLength({max: THREAD_CHAR_LIMIT}).withMessage(`Text should be within ${THREAD_CHAR_LIMIT} characters.`),

            /* Name Validation */
            body('name')
                .trim()
                .customSanitizer(value => {
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