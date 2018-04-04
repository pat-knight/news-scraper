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

app.use(express.static(path.join(__dirname, 'public')));

const routes = require('./routes/html');
// const htmlRouter = require('./routes/html');
// const apiRouter = require('./routes/api');

// app.get('/', function(req, res) {
//   res.render('index');
// });

app.use(routes);
// app.use('/api', apiRouter);

// app.get("/scrape", function(req, res) {
//   request("https://www.theonion.com", function(error, response, html) {
//     let $ = cheerio.load(html);

//     let results = [];

//     $("h1.headline").each((i, element) => {

//       let title = $(element).text();

//       let link = $(element)
//         .children()
//         .attr("href");

//       results.push({
//         title,
//         link
//       });
//     });
//     // db.scrapedData.insertMany(results);
//     console.log(results);
//   });
// });


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});