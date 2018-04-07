const express = require('express');
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';
const bodyParser = require('body-parser');
const logger = require('morgan');
const request = require('request');
const cheerio = require('cheerio');
const exprhbs = require('express-handlebars');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();

// view engine setup
app.engine("handlebars", exprhbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  // useMongoClient: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public/')));

const routes = require('./routes/html');

app.use(routes);

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});