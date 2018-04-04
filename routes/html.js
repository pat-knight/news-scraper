// const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const router = require('express').Router();
const db = require('../models');
// const app = express();


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

router.get("/scrape", function(req, res) {
  request("https://www.theonion.com", function(error, response, html) {
    let $ = cheerio.load(html);

    let results = [];

    $("h1.headline").each((i, element) => {

      let title = $(element).text();

      let link = $(element)
        .children()
        .attr("href");

      results.push({
        title,
        link
      });
    });
    // db.scrapedData.insertMany(results);
    console.log(results);
  });
});

module.exports = router;
