const database = require('./model/database.js');
const Board = require('./model/board.js');
const Post = require('./model/post.js');
const connectToDb = require('./model/database.js');

database.connectToDb();

async function test() {
    let post = new Post({
        text: 'i saw an alien in taft ama',
        image: 'Alien.jpg', //under /postimgs/
        type: 'THREAD',
        board: 'ufo',
        ip: '0.0.0.0',
        noOfPosts: 1,
        ownerCookie: 'test'
    });
    await post.save();
    
    let number = post.postNumber;
    let reply = new Post({
        text: `>>${number}\n kys`,
        type: 'REPLY',
        board: 'ufo',
        ip: '0',
        parentPost: number,
        ownerCookie: 'test'
    })
    await reply.save();
    post.quotes.push(reply.postNumber);
    await post.save();
    
    let ufo = new Board({
        name: 'ufo',
        displayName: '🛸/UFO'
    });

    await Promise.all([
        ufo.save(),
        //save added boards here

    ]);

    
}

test();











