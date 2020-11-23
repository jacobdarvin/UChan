// Schemas
const Board = require('../model/board.js');
const Post = require('../model/post.js');

// Helpers
const fsHelper = require('../helper/fsHelper.js');
const sanitize = require('mongo-sanitize');

// Validators
const {ThreadValidator} = require('../validator/threadValidator.js');
const { THREAD } = require('../validator/threadValidator.js');

const BoardController = {

    getBoard: function(req, res) {
        async function getBoard() {
            let board = sanitize(req.params.board);

            
            let noOfThreadLimit = 20; //for testing
            let threads = await Post.find({board: board, type: 'THREAD'}).sort({bump: 'desc'}).limit(noOfThreadLimit).lean();
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
                displayName: boardResult.displayName,
                action: `/createThread/${board}`
            });
        }

        getBoard();
    },

    createThread: (req, res) => {
        async function createThread() {
            let isValid =  await ThreadValidator.createPostValidation(req, THREAD);
            if (!isValid) {
                res.render('404', {title: '404'});
                return;
            }

            let ip = req.ip || req.connection.remoteAddress;
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
            });
            await post.save();

            if (req.file) {
                console.log('hasimage')
                let imageDbName = fsHelper.renameImageAndGetDbName(post._id, req.file);
                post.image = imageDbName;
                post.imageDisplayName = req.file.originalName;
                await post.save();
            }

            //TODO bumping algo

            //TODO: change to res.redirect when thread is hooked up
            res.redirect(`/thread/${post.postNumber}`);
        }

        createThread(); 
    },

    validateCaptcha: (req, res) => {
        async function validateCaptcha() {
            let captchaResult = await ThreadValidator.captchaValidation(req.body.captcha);

            res.send(captchaResult);
        }

        validateCaptcha();
    }
}

module.exports = BoardController;