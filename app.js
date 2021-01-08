const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require("lodash");
const nodemailer = require('nodemailer');

const app = express();

let transport = nodemailer.createTransport({
		service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
       user: 'doghouseband7@gmail.com',
       pass: 'Allwoodhomo7'
    }
});

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

app.get("/success", function(req, res) {
  activePage = ["","",""];
  res.render("success", {
    activePage : activePage
  });
});

app.get("/failed", function(req, res) {
  activePage = ["","",""];
  res.render("failed", {
    activePage : activePage
  });
});

app.post("/contact", function(req, res){
const userName = req.body.userName;;
const userEmail = req.body.userEmail;
const userMessage = req.body.userMessage;

const finalMessage = {
  from: userEmail,
  to: "doghouseband7@gmail.com",
  subject: "הודעה שהתקבלה דרך האתר מ" + userName,
  text: userMessage + " מייל לחזרה: " + userEmail
};

transport.sendMail(finalMessage, function(err, info){
  if (err) {
    console.log(err);
    res.redirect("/failed");
  } else {
    console.log("sucess");
    res.redirect("/success");
  };
});

});

app.listen(3000, function() {
  console.log("Server started successfully on port 3000");
});
