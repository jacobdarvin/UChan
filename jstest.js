let Post = require('./model/post.js');
function test() {
    Post.findOne({postNumber: 21212121}).exec((err, res) => {
        return;
    });

    console.log('reached');
}

test();