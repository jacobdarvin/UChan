const database = require('./model/database.js');
const User = require('./model/user.js');

database.connectToDb();

(async function() {
    let user = await User.findOne({name: 'nigga'});
    user.rank = 'ADMIN';
    //user['boards'].push('ufo');
    await user.save();
})();