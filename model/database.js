const autoincrement = require('mongoose-auto-increment');
const mongoose = require('mongoose');


let url = "mongodb+srv://justingalura:uchanpassword@cluster0.eorl4.mongodb.net/uchantestdb?retryWrites=true&w=majority"

//Uncomment when website is deployed.
/* 
const port = process.env.PORT;
if (port == null || port == "") {
    url = 'mongodb://localhost:27017/uchantestdb';
} */

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

const connectToDb = function() {
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
    mongoose.connect(url, options, function(error) {
        if(error) throw error;
        console.log('Connected to: ' + url);
    });
};

/* DB Constants */
const THREAD_CHAR_LIMIT = 2000;
const IMAGE_SIZE_LIMIT = 1048576 * 2; // 2MB
const NAME_LIMIT = 20;


module.exports = {connectToDb, THREAD_CHAR_LIMIT, IMAGE_SIZE_LIMIT, NAME_LIMIT};
