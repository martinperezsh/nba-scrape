var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

var app = express();

var Post = require('./models/Post.js')

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended: false
}));
// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/nbadb");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function (error) {
	console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
	console.log("Mongoose connection successful.");
});

app.get("/scrape", function(req, res) {
  // Make a request for the nba site
  request("https://www.reddit.com/r/nba/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
// Path to find info being scraped
    $("p.title").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
     
      var title = $(element).text();
      var link = $(element).children().attr("href");
      
      var results = {
        title: title,
        link: link
      }

      if (title && link) {
        // Insert the data in the scrapedData db
        var newPost = new Post(results);
        newPost.save(function(error, doc){
          if (error) {
            console.log('Error: ' + error);
          }
          else {
            console.log(doc);
          }
        })
      }
        
        
        
        
      }
    );
  });
  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});

app.listen(3000, function () {
	console.log("App running on port 3000!");
});