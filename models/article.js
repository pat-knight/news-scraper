const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const articleSchema = new Schema({

    Headline: {
        type: String
    },
    Summary: {
        type: String
    },
    URL: {
        type: String
    }
});