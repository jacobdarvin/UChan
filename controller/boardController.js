// Schemas
const Board = require('../model/board.js');
const Post = require('../model/post.js');

// Helpers
const fsHelper = require('../helper/fsHelper.js');
const sanitize = require('mongo-sanitize');

// Validators
const {ThreadValidator} = require('../validator/threadValidator.js');
const { THREAD } = require('../validator/threadValidator.js');

// Cookies
const uid = require('uid-safe');

const BoardController = {

    getBoard: function(req, res) {
        async function getBoard() {
            await ThreadValidator.cookieValidation(req, res);

            let board = sanitize(req.params.board);
            let noOfThreadLimit = 20; //for testing
            let [threads, boardResult] = await Promise.all([

                Post.find({board: board, type: 'THREAD'}).sort({bump: 'desc'}).limit(noOfThreadLimit).lean(),

                Board.findOne({name: board}).select('displayName')

            ]).catch(error => {
                res.render('404', {
                    title: 'An error occured!'
                });
                console.log(error);
                return;
            })

            if (!boardResult) {
                res.render('404', {
                    title: 'Board not found!'
                });
                return;
            }

            res.render('board', {
                title:        boardResult.displayName,
                displayName:  boardResult.displayName,

                threads:      threads,
                boardName:    board, //PENIS
                action:       `/createThread/${board}`
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

            await ThreadValidator.cookieValidation(req, res);

            let owner = sanitize(req.cookies.local_user);
            let ip = sanitize(req.ip) || sanitize(req.connection.remoteAddress);
            let text = sanitize(req.body.text);
            let name = sanitize(req.body.name);
            let file = sanitize(req.file);
            let board = sanitize(req.params.board);

            let post = new Post({
                text: text,
                name: name,
                type: 'THREAD',
                board: board,
                ip: ip,
                ownerCookie: owner
            });
            await post.save();

            if (req.file) {
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
