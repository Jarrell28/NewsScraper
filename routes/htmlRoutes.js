var db = require("../models");
var axios = require("axios");

module.exports = function (app) {

    // Load index page
    app.get("/", function (req, res) {
        res.render("index");
    });

    app.get("/saved", function (req, res) {
        db.Article.find().then(data => {
            res.render("saved", {
                articles: data
            });
        })
    })

    app.get("/test", function (req, res) {
        res.render("test");
    })

};
