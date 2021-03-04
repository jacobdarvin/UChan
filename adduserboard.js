const database = require('./model/database.js');
const User = require('./model/user.js');
const ReportedPost = require('./model/reportedpost.js');

database.connectToDb();

(async function() {
    let name = '';
    
    if (!name || name.trim() === '') {
        console.log('empty');
    }

})();