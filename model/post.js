const autoincrement = require('mongoose-auto-increment');
const mongoose = require('mongoose');
const database = require('./database.js');

const PostSchema = new mongoose.Schema({
    /* Visible in Front*/
    postNumber: {
        type: Number,
        unique: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        maxlength: database.NAME_LIMIT,
        default: 'Anonymous'
    },
    archived: {
        type: Boolean,
        default: false
    },

    /* How it is fetched internally */
    image: {
        type: String
    },
    /* How it is displayed externally */
    imageDisplayName: {
        type: String
    },
    quotes: [{
        type: String,
        ref: 'Post'
    }],

    /* Invisible info */
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
        //select: false
    },
    ownerCookie: {
        type: String, 
        required: true
    },

    /*If post is a THREAD */
    noOfPosts: {
        type: Number,
        default: 0
    },
    noOfImages: {
        type: Number,
        default: 0,
    },
    uniqueIps: [String],
    
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

PostSchema.pre('remove', function(next) {
    let post = this;
    post.model('Post').updateMany(
        {quotes: post.postNumber},
        {$pull: {quotes: post.postNumber}},
        {multi: true},
        next);
})

module.exports = mongoose.model('Post', PostSchema);
