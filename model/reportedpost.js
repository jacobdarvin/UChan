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
    banned: {
        type: Boolean,
        default: false
    },
    file: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },

    offTopicCounter: {
        type: Number,
        default: 0
    },
    lawCounter: {
        type: Number,
        default: 0
    },
    spamCounter: {
        type: Number,
        default: 0
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