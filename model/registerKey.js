const mongoose = require('mongoose');

const RegisterKey = mongoose.Schema({
    key: {
        type: String,
        unique: true
    }
});

module.exports = mongoose.model('RegisterKey', RegisterKey);
