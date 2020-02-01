const express = require('express');
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
// require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);


// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsScraper", { useNewUrlParser: true });


app.listen(PORT, () => console.log("App Listening on port " + PORT));