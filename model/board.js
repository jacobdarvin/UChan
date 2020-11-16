const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        lowercase: [true, 'Board name should be in lowercase'],
        trim: true,
        maxlength: [3, 'Board name should not exceed 3 characters.']
    },
    displayName: {
        type: String,
        unique: true,
        required: true
    },

    /* Image Details */
    imageLimit: {
        type: Number,
        required: true,
        default: 100
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
    }
});

module.exports = mongoose.model('Board', BoardSchema);