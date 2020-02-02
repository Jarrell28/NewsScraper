var db = require("../models");
var axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

module.exports = function (app) {

    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get("http://www.espn.com/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            var articles = [];

            // Now, we grab every h2 within an article tag, and do the following:
            $(".contentItem__content--story").each(function (i, element) {
                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this).find("h1").text();
                result.link = "https://www.espn.com" + $(this).find("a").attr("href");
                result.description = $(this).find("p").text();

                articles.push(result);


            });

            // Send a message to the client
            res.json(articles);
        });
    });

    app.post("/saved", function (req, res) {
        //Create a new Article using the`result` object built from scraping
        const article = req.body;
        const response = {};

        db.Article.create(article)
            .then(function (dbArticle) {
                // View the added result in the console
                response.success = true;
                res.json(response);
            })
            .catch(function (err) {
                // If an error occurred, log it
                response.success = false;
                res.json(response);
                console.log(err);
            });
    })

    app.delete("/saved/:id", function (req, res) {
        const id = req.params.id;

        var response = {};
        db.Article.deleteOne({ _id: mongoose.Types.ObjectId(id) }).then(() => {
            response.success = true;
            res.json(response);
        })
    });

};
