const database = require('./model/database.js');
const Board = require('./model/board.js');
const Post = require('./model/post.js');
const connectToDb = require('./model/database.js');

database.connectToDb();
Board.findOne({name: 'ufo'})
    .populate('threads')
    .exec((err, result) => {
        console.log(result);
    })

Post.find({}, (err, result) => {
    console.log(result);
})