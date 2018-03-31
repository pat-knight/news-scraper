var express = require('express');
var router = express.Router();
const app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.get("/scrape", function(req, res) {
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
    db.scrapedData.insertMany(results);
    console.log(results);
  });
});

module.exports = router;
