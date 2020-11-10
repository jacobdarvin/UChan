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

module.exports = connectToDb;
