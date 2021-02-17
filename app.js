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

// check if there is no data in the db and create the default content if there is none

Content.find({ }, function (err, foundContent) {
  if (foundContent.length === 0) {
    Content.insertMany([
{ name: "mdhe", title: "אנחנו דוגהאוס!", paragraph: "אנחנו להקת רוק שאוהבת לעשות שטויות כמו לכתוב טקסט שממלא חלקים באתר!"},
{ name: "tndhe", title: "רוצים להיות תמיד מעודכנים? הרשמו לניוזלטר שלנו"},
{ name: "omdhe", title: "המוזיקה שלנו"},
{ name: "tsdhe", title: "הופעות קרובות"},
{ name: "ps1dhe", paragraph: "הופעה בלבונטין בתאריך ככה ובשעה ככה"},
{ name: "ps2dhe", paragraph: "הופעה במאדים בתאריך שכזה ושעה שכזו"},
{ name: "ps3dhe", paragraph: "הופעה שהיא הופעה שכזו וכאלה"},
{ name: "ps4dhe", paragraph: "הופעה משותפת עם החתולים הסמוראיים"},
{ name: "ps5dhe", paragraph: "סיבוב הופעות מסביב לעולם ב 80 יום"},
{ name: "tsudhe", title: "בקשתך התקבלה בהצלחה"},
{ name: "tsfdhe", title: "בקשתך נכשלה", paragraph: "לצערינו בקשתך לא צלחה, אנא נסה שנית מאוחר יותר"},
{ name: "audhe", title: "אז מי אנחנו בכלל?", paragraph:""},
{ name: "mhel", title: "", paragraph: "",},
{ name: "tnhel", title: ""},
{ name: "omhel", title: ""},
{ name: "tshel", title : ""},
{ name: "ps1hel", paragraph: ""},
{ name: "ps2hel", paragraph: ""},
{ name: "ps3hel", paragraph: ""},
{ name: "ps4hel", paragraph: ""},
{ name: "ps5hel", paragraph: ""},
{ name: "tsuhel", title: ""},
{ name: "tsfhel", title: "", paragraph: ""},
{ name: "auhel", title: "", paragraph:""},
{ name: "mhe", title: "", paragraph: ""},
{ name: "tnhe", title: ""},
{ name: "omhe", title: ""},
{ name: "tshe", title : ""},
{ name: "ps1he", paragraph: ""},
{ name: "ps2he", paragraph: ""},
{ name: "ps3he", paragraph: ""},
{ name: "ps4he", paragraph: ""},
{ name: "ps5he", paragraph: ""},
{ name: "tsuhe", title: ""},
{ name: "tsfhe", title: "", paragraph: ""},
{ name: "auhe", title: "", paragraph:""}
    ]);
    console.log("Found no data in the DB and created the default data");
  } else {
    console.log("No need to create default content, you are good to go :)");
  }
});

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  activePage = ["active", "", "", ""];
  Content.find({ }, function (err, foundContent) {
    if (foundContent.length === 0) {
      console.log(err);
    } else {
      res.render('main', {
        activePage: activePage,
        // section names
        //main title and paragraph
        mthe: foundContent[0].title,
        mphe: foundContent[0].paragraph,
        //newsletter
        tnhe: foundContent[1].title,
        //our music
        omthe: foundContent[2].title,
        //shows
        tsdhe: foundContent[3].title,
        ps1he: foundContent[4].paragraph,
        ps2he: foundContent[5].paragraph,
        ps3he: foundContent[6].paragraph,
        ps4he: foundContent[7].paragraph,
        ps5he: foundContent[8].paragraph
      });
    }
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
  Content.findOne({name:"audhe"}, function(err, foundContent){
    if (foundContent === 0) {
      console.log(err);
    } else {
      res.render("about", {
        activePage: activePage,
        auhe: foundContent.title
      });  
    }
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

app.get('/success', function (req, res) {
  activePage = ["", "", ""];

  // finding the specific content I'm looking for and showing it in the page

  Content.findOne({ name: "tsudhe" }, function (err, foundContent) {
    if (foundContent === 0) {
      console.log(err);
    } else {
      res.render('success', {
        activePage: activePage,
        tsuhe: foundContent,
      });
    }
  });
});

app.get('/failed', function (req, res) {
  activePage = ["", "", ""];

  Content.findOne({ name:"tsfdhe"}, function(err, foundContent){
    if (foundContent === 0) {
      console.log(err);
    } else {
      res.render('failed', {
        activePage: activePage,
        tsfdhe: foundContent
      });
    }
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
