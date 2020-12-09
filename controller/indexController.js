const Post = require('../model/post.js');

const IndexController = {

    getIndex: (req, res) => {
        async function getIndex() {
            if(!req.cookies.local_user){
                let cookieValue = await uid(18);
                res.cookie('local_user', cookieValue, {maxAge: 108000})
            }
            
            let threads = await  Post.find({type: 'THREAD'})
                            .sort({bump: 'desc'})
                            .limit(8)
                            .lean();

            res.render('index', {
                title: 'UChan',
                threads: threads
            });
        }

        getIndex();
    }
}

module.exports = IndexController;
