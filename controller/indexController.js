const Post = require('../model/post.js');

const IndexController = {

    getIndex: (req, res) => {
        async function getIndex() {
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