require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

let transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

let activePage = ["", "", ""];

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/doghouseDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const contentSchema = new mongoose.Schema({
  name: String,
  title: String,
  paragraph: String,
});

userSchema.plugin(passportLocalMongoose);

const Content = new mongoose.model("Content", contentSchema);
const User = new mongoose.model("User", userSchema);

const mdhe = new Content({
  name: "mdhe",
  title: "אנחנו דוגהאוס!",
  paragraph:
    "אנחנו להקת רוק שאוהבת לעשות שטויות כמו לכתוב טקסט שממלא חלקים באתר!",
});

Content.find({ name: "mdhe" }, function (err, foundContent) {
  if (foundContent === 0) {
    mdhe.save();
  } else {
    console.log("no need to create default content");
  }
});

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  activePage = ["active", "", "", ""];
  res.render("main", {
    activePage: activePage,
  });
});

app.get("/contact", function (req, res) {
  activePage = ["", "active", "", ""];
  res.render("contact", {
    activePage: activePage,
  });
});

app.get("/about", function (req, res) {
  activePage = ["", "", "active", ""];
  res.render("about", {
    activePage: activePage,
  });
});

/* app.get("/register", function(req, res) {
  activePage = ["","","active",""];
  res.render("register", {
    activePage : activePage
  });
});

app.post("/register", function(req, res){
	User.register({
    username: req.body.username
  }, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect('/failed');
    } else {
      passport.authenticate('local')(req, res, function(){
        res.redirect('/success');
      });
    }
  });
}); */

app.get("/success", function (req, res) {
  activePage = ["", "", ""];

  // finding the specific content I'm looking for and showing it in the page

  Content.findOne({ name: "tsudhe" }, function (err, foundContent) {
    if (foundContent === 0) {
      console.log(err);
    } else {
      res.render("success", {
        activePage: activePage,
        tsuhe: foundContent,
      });
    }
  });
});

app.get("/failed", function (req, res) {
  activePage = ["", "", ""];
  res.render("failed", {
    activePage: activePage,
  });
});

app.post("/contact", function (req, res) {
  const userName = req.body.userName;
  const userEmail = req.body.userEmail;
  const userMessage = req.body.userMessage;

  const finalMessage = {
    from: userEmail,
    to: process.env.GMAIL_USER,
    subject: "הודעה שהתקבלה דרך האתר מ" + userName,
    text: userMessage + " מייל לחזרה: " + userEmail,
  };

  transport.sendMail(finalMessage, function (err, info) {
    if (err) {
      console.log(err);
      res.redirect("/failed");
    } else {
      console.log("mail sent sucessfully");
      res.redirect("/success");
    }
  });
});

app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.redirect("/failed");
    } else {
      passport.authenticate("local")(req, res, function () {
        if ((username = process.env.ADMIN)) {
          res.redirect("/edit");
        } else {
          res.redirect("/success");
        }
      });
    }
  });
});

app.get("/edit", function (req, res) {
  if (req.isAuthenticated()) {
    activePage = ["", "", ""];
    res.render("edit", {
      activePage: activePage,
    });
  } else {
    res.redirect("/failed");
  }
});

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started successfully on port 3000");
});
