const mongoose = require('mongoose');

//TODO: this
const Log = new mongoose.Schema({
    type: {
        enum: ['POST', 'DELETE', 'STICKY'],
        required: true
    },
    user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    //TODO: text remarks??
});

module.exports = Log;
