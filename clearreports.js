const database = require('./model/database.js');
const ReportedPost = require('./model/reportedpost.js');
const BannedIP = require('./model/bannedip.js');
const fs = require('fs-extra');
const RegisterKey = require('./model/registerKey.js');

database.connectToDb();
async function test() {
    //ReportedPost.deleteMany({}, () => {})
    //ReportedPost.collection.drop();
    //BannedIP.collection.drop();
    RegisterKey.collection.drop();
    //fs.emptyDir('./admin/reportedimgs');
}

test();