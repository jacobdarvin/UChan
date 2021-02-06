const database = require('./model/database');
const RegisterKey = require('./model/registerKey.js');

database.connectToDb();

async function test() {

/*
    try {
        let key = new RegisterKey({
            defaultBoard: 'ufo'
        });

        await key.save();
    } catch (e) {
        console.log(e);
    } */

    //RegisterKey.collection.drop();
    //return;
    try {
        let registers = await RegisterKey.find();
        console.log(registers);
    } catch (e) {
        console.log(e);
    }


}

test();