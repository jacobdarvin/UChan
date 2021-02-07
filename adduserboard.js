const database = require('./model/database.js');
const User = require('./model/user.js');

database.connectToDb();

(async function() {
    let user = await User.findOne({name: 'admin'});
    user.boards = ['ufo', 'cas', 'vgs', 'fas', 'ccs', 'dls', 'inv'];
    //user['boards'].push('ufo');
    await user.save();
})();