require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require("lodash");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

let transport = nodemailer.createTransport({
		service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
       user: process.env.GMAIL_USER,
       pass: process.env.GMAIL_PASS
    }
});

let activePage = ["","",""];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/doghouseDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});


const userSchema = new mongoose.Schema({
	username: String,
	password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  activePage = ["active","","",""];
  res.render("main", {
    activePage : activePage
  });
});

app.get("/contact", function(req, res) {
  activePage = ["","active","",""];
  res.render("contact", {
    activePage : activePage
  });
});

app.get("/about", function(req, res) {
  activePage = ["","","active",""];
  res.render("about", {
    activePage : activePage
  });
});

// app.get("/register", function(req, res) {
//   activePage = ["","","active",""];
//   res.render("register", {
//     activePage : activePage
//   });
// });
//
// app.post("/register", function(req, res){
// 	bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
// 		const newUser = new User({
// 			username : req.body.username,
// 			password: hash
// 		});
// 	newUser.save(function(err){
// 		if (err) {
// 			console.log(err);
// 			res.redirect("/failed");
// 		} else {
// 			res.redirect("/success");
// 		}
// 	});
// });
// });

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
  to: process.env.GMAIL_USER,
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

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = (req.body.password);

  User.findOne({
    username: username
  }, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result === true) {
            res.render("edit");
          } else {
            console.log(err);
          }
        });
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server started successfully on port 3000");
});
