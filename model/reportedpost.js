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
    date: {
        type: Date,
        default: Date.now
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

/* Post: 113244 Board: Ufo Comment: kys File: alien.jpg

        Reports
            Reason: lAW, IP
            Reason: OFFTOPIC, IP

      Post: 113244 LAW Board
      Post: 113444 OFFTOPIC Board
      Post: 113444
      ...n
 */

module.exports = mongoose.model('ReportedPost', ReportedPost);