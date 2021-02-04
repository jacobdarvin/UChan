const User = require('./model/user');
const database = require('./model/database');

database.connectToDb();
async function test() {
    try {
        let results = await User.find();
        console.log(results);
    } catch (e) {
        console.log(e);
    }
}

test();