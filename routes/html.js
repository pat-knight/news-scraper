// const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const router = require('express').Router();
const Comment = require('../models/comment');
const Article = require('../models/article');
// const db = require('../models');
// const app = express();


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get("/scrape", function(req, res) {
  request("https://www.theonion.com", function(error, response, html) {
    let $ = cheerio.load(html);

    let results = [];

    $("article.postlist__item").each((i, element) => {

      let title = $(element)
      .children('header')
      .children('h1.headline')
      .text();

      let url = $(element)
        .find('a.js_entry-link')
        .attr("href");

      let summary = $(element)
        .find('p')
        .text();

      results.push({
        title,
        url,
        summary
      });
    });
    // db.scrapedData.insertMany(results);
    console.log(results);
  });
});

router.get('/articles', function(req, res) {
  Article.find().sort({_id: -1})
  .populate('comments')
  .exec(function(err, doc) {
    if (err) {
      console.log(err)
    } else {
      let hbsObject = {articles: doc}
      res.render('index', hbsObject);
    }
    
  })
})

module.exports = router;
