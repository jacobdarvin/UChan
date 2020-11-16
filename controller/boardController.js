// Schemas
const Board = require('../model/board.js');
const Post = require('../model/post.js');

// Helpers
const sanitize = require('mongo-sanitize');
const {validationResult} = require('express-validator');

const BoardController = {

    getBoard: function(req, res) {

        /* Express-Validator error checks */
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            let details = {};
            for (let i = 0; i < errors.length; i++) {
                details[errors[i].param + 'Error'] = errors[i].msg;
            }

            res.render('404', {
                title: '404 Not Found'
            });

            console.log(details);
            return;
        }

        let board = req.params.board;

        /* Get Threads of a Board*/
        Post.find({board: board, type: 'THREAD'})
            .sort({bump: 'desc'})
            .lean()
            .exec((err, threads) => {
                if (threads.length == 0) {
                    res.render('404', {
                        title: 'Board not found!'
                    });
                    return;
                }

            /* Then get board display name */     
            Board.findOne({name: board})
                .select('displayName')
                .exec((err, boardResult) => {
                    res.render('board', {
                        title: boardResult.displayName,
                        threads: threads,
                        displayName: boardResult.displayName
                    });
            });
        });
    }
}

module.exports = BoardController;