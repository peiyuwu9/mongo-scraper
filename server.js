var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

var app = express();

app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });

// 0. HTML route to home page
app.get("/", function (req, res) {
    res.render("index");
});

// 1. Route to scrape aticles
app.get("/scraping", function (req, res) {
    axios.get("https://www.nytimes.com/")
        .then(function (response) {
            var $ = cheerio.load(response.data);
            $("div.css-6p6lnl").each(function (i, element) {
                var article = {};

                article.articleTitle = $(this).find("h2").text();
                article.link = "https://www.nytimes.com" + $(this).find("a").attr("href").toString();
                article.articleBody = $(this).find("p").text();
                article.saveStatus = false;

                db.Article.create(article)
                    .then(function () {
                        console.log("Articles Scraped.");
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });
            res.redirect("/");
        });
});

// 1.1 Route to get all scraped aticles
app.get("/scraping/all/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// 2. Route to save the article
app.put("/saveArticles/:id", function (req, res) {
    db.Article.update(
        {
            _id: req.params.id
        },
        {
            $set: {
                saveStatus: true
            }
        })
        .then(function () {
            res.send("Articles Saved.");
        })
        .catch(function (err) {
            res.json(err);
        });
});

// 3. Route to delete all articles from Articles collection
app.delete("/clearAll", function (req, res) {
    db.Article.remove({})
        .then(function () {
            res.send("Articles Deleted.");
        })
        .catch(function (err) {
            res.json(err);
        });
});

// 4.1  Route to saved-article page and show all saved articles
app.get("/saved", function (req, res) {
    res.render("saved");
});

// 4.2 Route to show all saved articles
app.get("/savedArticles", function (req, res) {
    db.Article.find({ saveStatus: true })
        .then(function (dbArticleSaved) {
            res.json(dbArticleSaved);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// 5. Route to unsave articles
app.put("/unsaveArticles/:id", function (req, res) {
    db.Article.update(
        {
            _id: req.params.id
        },
        {
            $set: {
                saveStatus: false
            }
        })
        .then(function () {
            res.send("Articles Unsaved.");
        })
        .catch(function (err) {
            res.json(err);
        });
});

// 6. Route to retrieve notes for specific article
app.get("/article/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticleNote) {
            res.json(dbArticleNote);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// 7. Route to post a note
app.post("/article/addNote/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function () {
            res.send("Note added.");
        })
        .catch(function (err) {
            res.json(err);
        });
});

// 8. Route to delete a note
app.delete("/article/deleteNote/:id", function (req, res) {
    db.Note.deleteOne({ _id: req.params.id })
    .then(function () {
        res.send("Note deleted.");
    })
    .catch(function (err) {
        res.json(err);
    });;
});

var PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT);
});

