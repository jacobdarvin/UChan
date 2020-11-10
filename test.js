const database = require('./model/database.js');
const Board = require('./model/board.js');
const Post = require('./model/post.js');
const connectToDb = require('./model/database.js');

connectToDb();

let board = new Board({
    name: 'ufo'
});
board.save();

let post = new Post({
    text: 'i saw an alien in taft ama',
    image: 'Alien.jpg', //under /postimgs/
    type: 'THREAD',
    board: 'ufo',
    ip: '0.0.0.0',
    quotes: [1000002]
});
post.save();

let reply = new Post({
    text: '>>1000001\n kys',
    type: 'REPLY',
    board: 'ufo',
    ip: '0',
    parentPost: 1000001
})
reply.save();







