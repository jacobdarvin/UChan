const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        maxlength: 128
    },
    type: {
        enum: ['ADMIN', 'MODERATOR'],
        default: 'MODERATOR'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    boards: [String]
});

module.exports = mongoose.model('User', User);
