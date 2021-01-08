const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require("lodash");

const app = express();

let activePage = ["","",""];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  activePage = ["active","",""];
  res.render("main", {
    activePage : activePage
  });
});

app.get("/contact", function(req, res) {
  activePage = ["","active",""];
  res.render("contact", {
    activePage : activePage
  });
});

app.get("/about", function(req, res) {
  activePage = ["","","active"];
  res.render("about", {
    activePage : activePage
  });
});

app.listen(3000, function() {
  console.log("Server started successfully on port 3000");
});
