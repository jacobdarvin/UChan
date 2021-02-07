const database = require('./model/database.js');
const User = require('./model/user.js');

database.connectToDb();

(async function() {
    let user = await User.findOne({name: 'DARVIN_REAL'});
    user.boards = ['ufo', 'cas'];
    //user['boards'].push('ufo');
    await user.save();
})();