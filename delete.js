const database = require('./model/database.js');
const Board = require('./model/board.js');
const Post = require('./model/post.js');
const connectToDb = require('./model/database.js');

database.connectToDb();

Post.deleteMany({}, () => {});
Board.deleteMany({}, () => {});