const database = require('./model/database.js');
const User = require('./model/user.js');
const ReportedPost = require('./model/reportedpost.js');

database.connectToDb();

(async function() {
    let post = await ReportedPost.findOne({postNumber: '1000683'});
    
    post.banned = false;

    await post.save();

})();