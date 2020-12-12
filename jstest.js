let Post = require('./model/post.js');
let database = require('./model/database.js')
database.connectToDb();
async function test() {
    let post = await Post.findOne({_id: '5fd4e4fadba17c4298782148'});
    await post.remove();
}

test();