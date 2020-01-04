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

app.get("/article/:id", function(req, res)
{
  db.Article.findOne({ _id: req.params.id })
  .populate("notes")
  .then(function(dbArticle)
  {
    //res.json(dbArticle);

    let hbsObject = { results: dbArticle };
    res.render("notes", hbsObject);
  })
  .catch(function(err)
  {
    res.json(err);
  });

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
      let topic = $(element).find("span").text();
      let articleTopicArr = topic.split("\n");
      topic = articleTopicArr[0];

      let title = $(element).find("a").text();
      let titleArr = title.split("\n");
      title = titleArr[titleArr.length-1].trim();
    
      let link = $(element).find("a").attr("href");
    
      // Save these results in an object that we'll push into the results array we defined earlier
      results.push(
      {
        topic: topic,
        title: title,
        link: link
      });

    });

    //console.log(results);
  
    // Send a message to the client
    let hbsObject = { results: results };
    res.render("scraped", hbsObject);
  });
});

app.post("/api/savearticle", function(req, res)
{
  db.Article.create(req.body)
    .then(function(dbArticle) 
    {
      res.json(dbArticle);
    })
    .catch(function(err) 
    {
      res.json(err);
    });
});

app.get("/savedArticles", function(req, res) 
{
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) 
    {
      res.json(dbArticle);
    })
    .catch(function(err) 
    {
      res.json(err);
    });
});

app.delete("/article/:id", function(req, res)
{
    db.Article.find({ _id: req.params.id }).remove()
    .then(function(dbArticle)
    {
        res.json(dbArticle);
    })
    .catch(function(err)
    {
        res.json(err);
    });
});

// I needed help figuring this part out...
app.post("/note", function(req, res)
{
  console.log(req.body);
  db.Note.create({ body: req.body.body })
  .then(function(dbNote)
  {
    return db.Article.findOneAndUpdate({ _id: req.body.articleId }, { $push: { notes: dbNote._id } }, { new: true });
  })
  .then(function(dbArticle)
  {
    res.json(dbArticle);
  })
  .catch(function(err)
  {
    res.json(err);
  });
});

app.delete("/note/:articleId/:noteId", function(req, res)
{
    db.Article.findOneAndUpdate({ _id: req.params.articleId }, { $pull: { notes: req.params.noteId } }, {new: true})
    .then(function(dbArticle)
    {
      return db.Note.find({ _id: req.params.noteId }).deleteOne();
    })
    .then(function(dbNote)
    {
      res.json(dbNote);
    })
    .catch(function(err)
    {
        res.json(err);
    });
});



// Start the server
app.listen(PORT, function() 
{
  console.log("App running on port " + PORT + "!");
});