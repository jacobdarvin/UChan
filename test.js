const database = require('./model/database.js');
const Board = require('./model/board.js');
const Post = require('./model/post.js');
const connectToDb = require('./model/database.js');

database.connectToDb();

let post = new Post({
    text: 'i saw an alien in taft ama',
    image: 'Alien.jpg', //under /postimgs/
    type: 'THREAD',
    board: 'ufo',
    ip: '0.0.0.0',
    quotes: [10000024],
    noOfPosts: 1
});
post.save();

let number = post.postNumber;
let reply = new Post({
    text: `>>1000023\n kys`,
    type: 'REPLY',
    board: 'ufo',
    ip: '0',
    parentPost: 1000023
})
reply.save();

let board = new Board({
    name: 'ufo'
});
board.save();












