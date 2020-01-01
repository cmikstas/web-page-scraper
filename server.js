let express = require("express");
let logger = require("morgan");
let mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
let axios = require("axios");
let cheerio = require("cheerio");

// Require all models
let db = require("./models");

let PORT = 3000;

// Initialize Express
let app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

//Set Handlebars.
let exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/web-scraper-homework", { useNewUrlParser: true });

app.get("/", function(req, res)
{
  res.redirect("/home");
});

app.get("/home", function(req, res)
{
  //let hbsObject = { user: req.user.username };
  res.render("home", /**hbsObject**/);
});

// app.get("/scraped", function(req, res)
// {
  
//   res.render("scraped", hbsObject);
// });

app.get("/saved", function(req, res)
{
        //let hbsObject = { user: req.user.username };
        res.render("saved", /**hbsObject**/);
});


// A GET route for scraping theringer dot com website
app.get("/scrape", function(req, res) 
{
  // First, we grab the body of the html with axios
  axios.get("https://www.theringer.com/").then(function(response)
  {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    //console.log(response.data);

    let results = [];
  
    // Now, we grab every h2 within an article tag, and do the following:
    $("div.c-entry-box--compact").each(function(i, element)
    {
      let articleTopic = $(element).find("span").text();
      let articleTopicArr = articleTopic.split("\n");
      articleTopic = articleTopicArr[0];

      let title = $(element).find("a").text();
      let titleArr = title.split("\n");
      title = titleArr[titleArr.length-1].trim();
    
      let link = $(element).find("a").attr("href");
    
      // Save these results in an object that we'll push into the results array we defined earlier
      results.push(
      {
        topic: articleTopic,
        title: title,
        link: link
      });

      for (let i = 0; i < results.length; i++)
      {
        
      }
  
      // // Create a new Article using the `result` object built from scraping
      // db.Article.create(results)
      //     .then(function(dbArticle) 
      //     {
      //         // View the added result in the console
      //         console.log(dbArticle);
      //     })
      //     .catch(function(err) 
      //     {
      //         // If an error occurred, log it
      //         console.log(err);
      //     });
    });

    //console.log(results);
  
    // Send a message to the client
    let hbsObject = { results: results };
    res.render("scraped", hbsObject);
  });
});


// Start the server
app.listen(PORT, function() 
{
  console.log("App running on port " + PORT + "!");
});