const mongoose = require('mongoose');

const RegisterKey = mongoose.Schema({
    defaultBoard: {
        type: String
    }
});

module.exports = mongoose.model('RegisterKey', RegisterKey);
