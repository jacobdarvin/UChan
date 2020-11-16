const Board = require('../model/board.js');
const Post = require('../model/post.js');

const BoardController = {
    getBoard: function(req, res) {
        let board = req.params.board;

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