const mongoose = require('mongoose');

const ReportedPost = new mongoose.Schema({
    postNumber: {
        type: Number,
        unique: true
    },
    board: {
        type: String,
        required: true,
        maxlength: 3
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    ip: {
        type: String,
        required: true
    },
    file: {
        type: String
    },

    reports: [{
        reason: {
            type: String,
            enum: ['OFF TOPIC', 'LAW', 'SPAM'],
            required: true
        },
        ip: {
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model('ReportedPost', ReportedPost);