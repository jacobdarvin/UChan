const Board = require('../model/board.js');
const Post = require('../model/post.js');

const dateHelper = require('../helper/dateHelper.js');
const sanitize = require('mongo-sanitize');

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
    }
}

module.exports = ThreadController;