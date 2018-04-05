const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({

    user: {
        type: String,
    },

    comment :{
        type: String,
    }
})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;