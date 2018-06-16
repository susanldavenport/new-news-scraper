// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//Scraping Requirements
const cheerio = require("cheerio");
const request = require("request");

//Initialize Express
const app = express();

//Require Models
const db = require("./models");
const PORT = process.env.PORT || 3000;

// Handling form submissions with Body-Parser
app.use(bodyParser.urlencoded({ extended: true }));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI);

// This makes sure that any errors are logged if mongodb runs into an issue
// db.on("error", function(error) {
  // console.log("Database Error:", error);
// });

// ROUTES

// Making a request for NYT. 
app.get('/scrape', function(req, res) {
  request("https://www.nytimes.com/section/technology", function(error, response, html) {
    let $ = cheerio.load(html);
    let results = [];
    $("div.story-body").each(function(i, element) {
      let title = $(element).children().children().children("h2.headline").text().trim();
      let summary = $(element).children().children().children("p.summary").text();
      let link = $(element).children().attr("href");
      results.push({
        title: title,
        summary: summary,
        link: link
      });      
    });
    res.json(results);
  })
});

// Create a new article with 'results scraped from site'
app.post("/articles", function(req, res) {
  db.Article.create(req.body)
    .then(function(dbArticle) {
      console.log(dbArticle);
      res.json(dbArticle);
    })
    .catch(function(err) {
      return res.json(err);
    });
})  

// Get articles from db
app.get("/articles", function(req, res) {
  db.Article.find({})
  .then(function(dbArticle) {
    res.json(dbArticle); 
  })
  .catch(function(err) {
    res.json(err); 
  })
});

//Select article & notes assoc. w article
app.get("/articles/:id", function(req, res) {
  db.Article.find({ _id: req.params.id })
  .populate("note")
  .then(function(dbArticle) {
    res.json(dbArticle)
  })
  .catch(function(err) {
    res.json(err); 
  })
});

//save or update note
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//delete route
app.delete("/articles/:id", function(req, res) {
  db.Article.remove({ _id: req.params.id})
    .then(function(dbArticle) {
      res.json(dbArticle)
    })
    .catch(function(err) {
      res.json(err);
    });
}); 

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});