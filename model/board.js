const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: [true, 'Board name should be in lowercase'],
        trim: true,
        maxlength: [3, 'Board name should not exceed 3 characters.']
    },

    /* Image Details */
    imageLimit: {
        type: Number,
        required: true,
        default: 100
    },
    maxImageSize: {
        type: Number,
        required: true,
        default: 2
    },

    /* Thread details */
    threadLimit: {
        type: Number,
        required: true,
        default: 80
    },
    bumpLimit: {
        type: Number, 
        required: true,
        default: 200
    },
    threads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
    }]
});

module.exports = mongoose.model('Board', BoardSchema);