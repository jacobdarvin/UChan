const mongoose = require('mongoose');

const ReportedPost = new mongoose.Schema({
    postNumber: {
        type: Number,
        unique: true
    },
    reports: [{
        reason: {
            enum: ['OFF TOPIC', 'LAW'],
            require: true
        },
        ip: {
            type: String,
            required: true
        }
    }]
});

module.exports = ReportedPost;