const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const articleSchema = new Schema({

    Title: {
        type: String,
        required: true
    },
    Summary: {
        type: String,
        required: true
    },
    URL: {
        type: String,
        required: true
    },
    
    Comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;