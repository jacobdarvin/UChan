const Board = require('../model/board.js');
const Post = require('../model/post.js');

const sanitize = require('mongo-sanitize');

const {validationResult} = require('express-validator');

const BoardController = {

    getBoard: function(req, res) {
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

        Post.find({board: board, type: 'THREAD'})
            .sort({bump: 'desc'})
            .lean()
            .exec((err, result) => {
                if (result.length == 0) {
                    res.render('404', {
                        title: 'Board not found!'
                    });
                    return;
                }

                res.render('board', {
                    title: board,
                    threads: result
                })
            })

        /* Board.findOne({name: board})
        .populate('threads')
        .lean()
        .exec(function(err, boardResult) {
            if (!boardResult) {
                res.render('404', {
                    title: '404 Not Found'
                })
                return;
            }
            
            res.render('board', {
                title: boardResult.name,
                threads: boardResult.threads
            })
        }) */
    }
}

module.exports = BoardController;