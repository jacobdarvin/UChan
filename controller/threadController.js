const Board = require('../model/board.js');
const Post = require('../model/post.js');

const dateHelper = require('../helper/dateHelper.js');
const fsHelper = require('../helper/fsHelper.js');
const sanitize = require('mongo-sanitize');
const { REPLY } = require('../validator/threadValidator.js');


const {ThreadValidator} = require('../validator/threadValidator.js');

//cookies
const uid = require('uid-safe');

const ThreadController = {

    getThread: (req, res) => {
        async function getThread(){
            let postNumber = sanitize(req.params.postNumber);

            if(!req.cookies.local_user){
                let cookieValue = await uid(18);
                res.cookie('local_user', cookieValue, {maxAge: 108000})
            }

            let [thread, replies] = await Promise.all([
                Post.findOne({postNumber: postNumber, type: 'THREAD'}).lean(),

                Post.find({parentPost: postNumber, type: 'REPLY'})
                        .sort({created: 'asc'})
                        .lean()
            ]).catch(error => {
                console.log(error);
                res.render('404', {title: 'An error occured!'});
                return;
            });

            if (!thread) {
                res.render('404', {title: 'Thread not found!'});
                return;
            }

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
            let parentPostNumber = req.params.postNumber;

            let parentPost = await Post.findOne({postNumber: parentPostNumber});
            if (!parentPost) {
                res.render('404', {title: '404'});
                return;
            }

            let reply = new Post({
                text: text,
                name: name,
                type: 'REPLY',
                board: parentPost.board,
                ip: ip,
                parentPost: parentPostNumber
            });
            await reply.save();
            await processQuotes(text, reply.postNumber);

            if (req.file) {
                console.log('hasimage')
                let imageDbName = fsHelper.renameImageAndGetDbName(reply._id, req.file);
                reply.image = imageDbName;
                reply.imageDisplayName = req.file.originalName;
                await reply.save();
            }

            //parent post
            if (!parentPost.uniqueIps.includes(ip)) {
                parentPost.uniqueIps.push(ip);
            }

            if (req.file) {
                parentPost.noOfImages = parentPost.noOfImages + 1;
            }
            parentPost.noOfPosts++;
        
            parentPost.bump = Date.now();
            await parentPost.save();


            res.redirect(req.get('referer'));
        }
        
        replyThread();
    }

}

async function processQuotes(text, postNumber) {
    //TODO: change to @
    let matches = text.match(/[>]{2}[\d]{7}/gm);
    if (!matches) {
        return;
    }
    let quotes = new Set();
    
    for (let i = 0; i < matches.length; i++) {
        var str = matches[i],
        delimiter = '>',
        start = 2,
        tokens = str.split(delimiter).slice(start),
        result = tokens.join(delimiter); // those.that
        
        quotes.add(parseInt(result));
    }

    // TODO: Stack overflow for more efficienct updating
    for (let item of quotes) {
        await Post.updateOne({postNumber: item}, {$addToSet: {quotes: postNumber}});
    }
}

module.exports = ThreadController;