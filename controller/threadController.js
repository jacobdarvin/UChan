const Board = require('../model/board.js');
const Post = require('../model/post.js');

const dateHelper = require('../helper/dateHelper.js');
const sanitize = require('mongo-sanitize');
const { REPLY } = require('../validator/threadValidator.js');

const ThreadController = {

    getThread: (req, res) => {
        async function getThread(){
            let postNumber = sanitize(req.params.postNumber);

            let thread = await Post.findOne({postNumber: postNumber, type: 'THREAD'}).lean();
            if (!thread) {
                res.render('404', {title: 'Thread not found!'});
                return;
            }

            let replies = await Post.find({parentPost: postNumber, type: 'REPLY'})
                                .sort({created: 'desc'})
                                .lean();
            let board = await Board.findOne({name: thread.board}).select('displayName').lean();
            
            /* Format dates*/
            thread.created = dateHelper.formatDate(thread.created);
            for (let i = 0; i < replies.length; i++) {
                replies[i].created = dateHelper.formatDate(replies[i].created);
            }

            res.render('thread', {
                title: board.displayName + ' - ' + thread.text,
                postNumber: thread.postNumber,
                displayName: board.displayName,
                action: `/replyThread/${thread.postNumber}`,

                image: thread.image,
                name: thread.name,
                created: thread.created,
                text: thread.text,
                nofOfPosts: thread.nofOfPosts,
                noOfImages: thread.noOfImages,
                uniqueIps: thread.uniqueIps,
                quotes: thread.quotes,
                imageDisplayName: thread.imageDisplayName,

                replies: replies 
            });
        }

        getThread();
    },

    replyThread: (req, res) => {
        async function replyThread() {
            let isValid =  await ThreadValidator.createPostValidation(req, REPLY);
            if (!isValid) {
                res.render('404', {title: '404'});
                return;
            }

            let ip = req.ip || req.connection.remoteAddress;
            let text = req.body.text;
            let name = req.body.name;
            let file = req.file;
            let parentPostNumber = req.params.parentPostNumber;

            let parentPost = await Post.findOne({postNumber: parentPostNumber});
            if (!parentPost) {

            }


        }
        
        replyThread();
    }

}

module.exports = ThreadController;