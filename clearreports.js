const database = require('./model/database.js');
const ReportedPost = require('./model/reportedpost.js');
const fs = require('fs-extra');

database.connectToDb();
async function test() {
    ReportedPost.deleteMany({}, () => {})

    fs.emptyDir('./admin/reportedimgs');
}

test();