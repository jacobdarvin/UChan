const database = require('./model/database.js');
const ReportedPost = require('./model/reportedpost.js');
const BannedIP = require('./model/bannedip.js');
const fs = require('fs-extra');

database.connectToDb();
async function test() {
    //ReportedPost.deleteMany({}, () => {})
    ReportedPost.collection.drop();
    BannedIP.collection.drop();
    fs.emptyDir('./admin/reportedimgs');
}

test();