// Schemas
const Board = require('../model/board.js');
const Post = require('../model/post.js');

// Helpers
const fsHelper = require('../helper/fsHelper.js');
const sanitize = require('mongo-sanitize');
const {validationResult} = require('express-validator');

const BoardController = {

    getBoard: function(req, res) {
        async function getBoard() {
            let board = sanitize(req.params.board);

            let threads = await Post.find({board: board, type: 'THREAD'}).sort({bump: 'desc'}).lean();
            if (threads.length == 0) {
                res.render('404', {
                    title: 'Board not found!'
                });
                return;
            }

            let boardResult = await Board.findOne({name: board}).select('displayName');
            res.render('board', {
                title: boardResult.displayName,
                threads: threads,
                displayName: boardResult.displayName
            });
        }

        getBoard();
    },

    createThread: (req, res) => {
        async function createThread() {
            const errors = validationResult(req);
            if (!errors.isEmpty) {
                console.log(errors.array());
    
                res.render('404', {
                    title: 'Error occured!'
                });
            }
    
            let ip = req.ip;
            let text = req.body.text;
            let name = req.body.name;
            let file = req.file;
            let board = req.params.board;
            
            
            let post = new Post({
                text: text,
                name: name,
                type: 'THREAD',
                board: board,
                ip: ip,
                imageDisplayName: file.originalName
            });
            await post.save();

            let imageDbName = fsHelper.renameImageAndGetDbName(post.postNumber, req.file);
            post.image = imageDbName;
            await post.save();

            //TODO bumping algo
            //TODO captcha (validator)
        }

        createThread();
    } 
}

module.exports = BoardController;