const ReportedPost = require('./model/reportedpost.js');
const database = require('./model/database.js');

database.connectToDb();
async function test() {
    let reports = await ReportedPost.find();

    for (let i = 0; i < reports.length; i++) {
        console.log(reports[i]);
        for (let j = 0; j < reports[i].reports.length; j++) {
            console.log(reports[i].reports[j]);
        }
    }
}

test();