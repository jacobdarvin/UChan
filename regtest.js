const database = require('./model/database');
const RegisterKey = require('./model/registerKey.js');

database.connectToDb();

async function test() {

    /*
    try {
        let key = new RegisterKey({
            key: 'BUYBUYBUY'
        });

        await key.save();
    } catch (e) {
        console.log(e);
    } */

    try {
        let registers = await RegisterKey.find();
        console.log(registers);
    } catch (e) {
        console.log(e);
    }


}

test();