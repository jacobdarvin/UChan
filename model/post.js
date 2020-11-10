const autoincrement = require('mongoose-auto-increment');
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    postNumber: {
        type: Number,
        unique: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        default: "300x300.png"
    },
    bump: {
        type: Date,
        required: true,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['THREAD', 'REPLY'],
        required: true
    },
    board: {
        type: String,
        required: true,
        maxlength: 3
    },
    ip: {
        type: String,
        required: true,
        select: false
    },
    quotes: [Number],
    
    

    /* If Post is a REPLY */
    parentPost: {
        type: Number
    }

});

autoincrement.initialize(mongoose.connection);
PostSchema.plugin(autoincrement.plugin, {
    model: 'Book',
    field: 'postNumber',
    startAt: 1000000,
    incrementBy: 1
});

module.exports = mongoose.model('Post', PostSchema);
