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

    /* BOARD LIST */
    let casual = new Board({
        name: 'cas',
        displayName: '💬/Casual'
    });

    let ufo = new Board({
        name: 'ufo',
        displayName: '🛸/UFO'
    });

    let games = new Board({
        name: 'vgs',
        displayName: '🕹️/Games'
    });

    let fashion = new Board({
        name: 'fas',
        displayName: '👕/Fashion'
    });

    let ccs = new Board({
        name: 'ccs',
        displayName: '💻/CCS'
    });

    let dlsu = new Board({
        name: 'dls',
        displayName: '💚/DLSU'
    });

    let investments = new Board({
        name: 'inv',
        displayName: '💸/Investments'
    });

    await Promise.all([
      casual.save(),
      ufo.save(),
      games.save(),
      fashion.save(),
      ccs.save(),
      dlsu.save(),
      investments.save(),
      //save added boards here
    ]);
}

test();
