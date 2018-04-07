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
  });
});


router.get('/articles', function(req, res) {
  Article.find().sort({_id: -1})
  .populate('comments')
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

router.post('/add/comment/:id', function (req, res){

  console.log(req)
  let articleId = req.params.id;
  let commentUser = req.body.user;
  let commentText = req.body.comment;

  let result = {
    user: commentUser,
    content: commentText
  };

  let entry = new Comment (result);

 
  entry.save(function(err, data) {
    if (err) {
      console.log(err);
    } 
    else {

      Article.findOneAndUpdate({'_id': articleId}, {$push: {'comments':data._id}}, {new: true})

      .exec(function(err, data){

        if (err){
          console.log(err);
        } else {

          res.sendStatus(200);
        }
      });
      // res.redirect('/articles');
    }
  });

});


router.post('/remove/comment/:id', function (req, res){


  let commentId = req.params.id;


  Comment.findByIdAndRemove(commentId, function (err, res) {  
    
    if (err) {
      console.log(err);
    } 
    else {
      res.sendStatus(200);
      // res.redirect('/articles');
    }

  });

});


module.exports = router;
