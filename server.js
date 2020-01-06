let express = require("express");
let logger = require("morgan");
let mongoose = require("mongoose");

let axios = require("axios");
let cheerio = require("cheerio");

let db = require("./models");
let PORT = process.env.PORT || 3000;
let app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let exphbs = require("express-handlebars");
app.engine("handlebars", exphbs(
{
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/web-scraper-homework"/*, { useNewUrlParser: true }*/;

mongoose.connect(MONGODB_URI);

app.get("/", function(req, res)
{
  res.redirect("/home");
});

app.get("/home", function(req, res)
{
  res.render("home");
});

app.get("/saved", function(req, res)
{
  res.render("saved");
});

app.get("/article/:id", function(req, res)
{
  db.Article.findOne({ _id: req.params.id })
  .populate("notes")
  .then(function(dbArticle)
  {
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
  axios.get("https://www.theringer.com/").then(function(response)
  {
    var $ = cheerio.load(response.data);

    //console.log(response.data);

    let results = [];
  
    $("div.c-entry-box--compact").each(function(i, element)
    {
      let topic = $(element).find("span").text();
      let articleTopicArr = topic.split("\n");
      topic = articleTopicArr[0];

      let title = $(element).find("a").text();
      let titleArr = title.split("\n");
      title = titleArr[titleArr.length-1].trim();
    
      let link = $(element).find("a").attr("href");
    
      results.push(
      {
        topic: topic,
        title: title,
        link: link
      });

    });

    //console.log(results);
  
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

// I didn't end up using this route
app.get("/savedNotes", function(req, res) 
{
  db.Note.find({})
    .then(function(dbNote) 
    {
      res.json(dbNote);
    })
    .catch(function(err) 
    {
      res.json(err);
    });
});

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

app.listen(PORT, function() 
{
  console.log("App running on port " + PORT + "!");
});