const mongoose = require('mongoose');

const BannedIP = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
        unique: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now
    },
    reason: {
        enum: ['OFF TOPIC', 'LAW'],
        required: true
    },
    remarks: {
        type: String
    }
});

module.exports = mongoose.model('BannedIP', BannedIP);
