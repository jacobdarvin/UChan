const Post = require('../model/post.js');
const uid = require('uid-safe');

const IndexController = {

    getIndex: (req, res) => {
        async function getIndex() {
            if(!req.cookies.local_user){
                let cookieValue = await uid(18);
                res.cookie('local_user', cookieValue, {maxAge:  (1000 * 60 * 60 * 24) * 30})
            }

            let threads = await  Post.find({type: 'THREAD'})
                            .sort({bump: 'desc'})
                            .limit(8)
                            .lean();

            res.render('index', {
                title: 'UChan',
                threads: threads,
                home_active: true,
            });
        }

        getIndex();
    }
}

module.exports = IndexController;
