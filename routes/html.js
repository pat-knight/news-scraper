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
  res.render('layouts/main');
});

router.get("/scrape", function(req, res) {
  request("https://www.theonion.com", function(error, response, html) {
    let $ = cheerio.load(html);

    let titles = [];
    
    $("article.postlist__item").each((i, element) => {
      
      let results = {};

      results.title = $(element)
      .children('header')
      .children('h1.headline')
      .text();

      results.url = $(element)
        .find('a.js_entry-link')
        .attr("href");

      results.summary = $(element)
        .find('p')
        .text();


      //check for duplicates, filter out non-formatted articles

      if(results.title !=='' && results.summary !==''){

      
      
      if(titles.indexOf(results.title) === -1) {

        titles.push(results.title);

        Article.count({ title: results.title}, function (err, count) {
          if (count === 0) {

            const newArticle = new Article (results);
    
            newArticle.save(function (err, data) {
              if (err) {
                console.log(err);
              } else {
                console.log(res);
              }
            });
          } else {
            console.log('entry already exists in database');
          }
        })

      }
    }
    });
    res.redirect('/articles');
    // res.render('index')
    // let hbsObject = {articles: data}
    //   res.render('index', hbsObject);
  });
});
// console.log(results);

router.get('/articles', function(req, res) {
  Article.find().sort({_id: -1})
  // .populate('comments')
  .exec(function(err, data) {
    if (err) {
      console.log(err)
    } else {
      console.log(data);
      let hbsObject = {articles: data}
      res.render('index', hbsObject);
    }
    
  })
})

module.exports = router;
