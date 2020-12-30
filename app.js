const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require("lodash");

const app = express();

const nonActivePage = "";

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("main", {
    aboutactive: nonActivePage,
    contactactive: nonActivePage,
    mainactive: "active"
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    aboutactive: nonActivePage,
    contactactive: "active",
    mainactive: nonActivePage
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutactive: "active",
    contactactive: nonActivePage,
    mainactive: nonActivePage
  });
});

app.listen(3000, function() {
  console.log("Server started successfully on port 3000");
});