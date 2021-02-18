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

//node mailer initialization

let transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// main variable for the main page

let activePage = ["", "", ""];

// ejs initialization

app.set("view engine", "ejs");

//body parser initizlization

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


//public folder loading for css and js files

app.use(express.static("public"));

// passport first initialization + sessions usage

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
);


app.use(passport.initialize());
app.use(passport.session());


//mongoose connection

mongoose.connect("mongodb://localhost:27017/doghouseDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("useCreateIndex", true);


//mongoose schemas

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const contentSchema = new mongoose.Schema({
  name: String,
  title: String,
  paragraph: String,
  paragraph1: String,
  paragraph2: String,
  paragraph3: String,
  paragraph4: String,
  link: String,
  link1: String,
  link2: String,
  link3: String,
  link4: String
});

userSchema.plugin(passportLocalMongoose);

//mongoose models

const Content = new mongoose.model("Content", contentSchema);
const User = new mongoose.model("User", userSchema);

//initilizing passport

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// check if there is no data in the db and create the default content if there is none

Content.find({ }, function (err, foundContent) {
  if (foundContent.length === 0) {
    Content.insertMany([
{ name: "mdhe", title: "אנחנו דוגהאוס!", paragraph: "אנחנו להקת רוק שאוהבת לעשות שטויות כמו לכתוב טקסט שממלא חלקים באתר!"},
{ name: "ndhe", title: "רוצים להיות תמיד מעודכנים? הרשמו לניוזלטר שלנו"},
{ name: "omdhe", title: "המוזיקה שלנו"},
{ name: "sdhe", title: "הופעות קרובות", paragraph: "הופעה בלבונטין בתאריך ככה ובשעה ככה", paragraph1: "הופעה במאדים בתאריך שכזה ושעה שכזו", paragraph2: "הופעה שהיא הופעה שכזו וכאלה", paragraph3: "הופעה משותפת עם החתולים הסמוראיים", paragraph4: "סיבוב הופעות מסביב לעולם ב 80 יום", link:"#", link1:"#", link2:"#", link3:"#", link4:"#"},
{ name: "sudhe", title: "בקשתך התקבלה בהצלחה"},
{ name: "fdhe", title: "בקשתך נכשלה", paragraph: "לצערינו בקשתך לא צלחה, אנא נסה שנית מאוחר יותר"},
{ name: "audhe", title: "אז מי אנחנו בכלל?", paragraph:""},
{ name: "mhel", title: "", paragraph: "",},
{ name: "nhel", title: ""},
{ name: "omhel", title: ""},
{ name: "shel", title : "", paragraph: "", paragraph1: "", paragraph2: "", paragraph3: "", paragraph4: "", link: "", link1: "", link2: "", link3: "", link4: ""},
{ name: "suhel", title: ""},
{ name: "fhel", title: "", paragraph: ""},
{ name: "auhel", title: "", paragraph:""},
{ name: "mhe", title: "", paragraph: ""},
{ name: "nhe", title: ""},
{ name: "omhe", title: ""},
{ name: "she", title : "", paragraph: "", paragraph1: "", paragraph2: "", paragraph3: "", paragraph4: "", link: "", link1: "", link2: "", link3: "", link4: ""},
{ name: "suhe", title: ""},
{ name: "fhe", title: "", paragraph: ""},
{ name: "auhe", title: "", paragraph:""}
    ]);
    console.log("Found no data in the DB and created the default data");
  } else {
    console.log("No need to create default content, you are good to go :)");
  }
});


// main page rendering

app.get("/", function (req, res) {
  activePage = ["active", "", "", ""];
  Content.find({ }, function (err, foundContent) {
    if (foundContent.length === 0) {
      console.log(err);
    } else {
      res.render('main', {
        activePage: activePage,
        // section content
        //main section content
        mdhe: foundContent[0],
        //newsletter content
        nhe: foundContent[1],
        //our music content
        omhe: foundContent[2],
        //shows content
        she: foundContent[3]
      });
    }
  });
});


// contact page rendering

app.get("/contact", function (req, res) {
  activePage = ["", "active", "", ""];
  res.render("contact", {
    activePage: activePage,
  });
});

// about page rendering

app.get("/about", function (req, res) {
  activePage = ["", "", "active", ""];
  Content.findOne({name:"audhe"}, function(err, foundContent){
    if (err) {
      console.log(err);
    } else {
      res.render("about", {
        activePage: activePage,
        auhe: foundContent
      });  
    }
  });
});


//sucess page rendering

app.get('/success', function (req, res) {
  activePage = ["", "", ""];

  // finding the specific title I'm looking for and showing it in the page

  Content.findOne({ name: "sudhe" }, function (err, foundContent) {
    if (err) {
      console.log(err);
    } else {
      res.render('success', {
        activePage: activePage,
        suhe: foundContent
      });
    }
  });
});

//failed page rendring

app.get('/failed', function (req, res) {
  activePage = ["", "", ""];

  Content.findOne({ name:"fdhe"}, function(err, foundContent){
    if (err) {
      console.log(err);
    } else {
      res.render('failed', {
        activePage: activePage,
        fhe: foundContent
      });
    }
  });
});

//contact function

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


// login function

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
        if (user.username === process.env.ADMIN) {
          res.redirect("/edit");
        } else if (user.username === process.env.EPK) {
            res.redirect("/epk");  
        } else {
          res.redirect("/");
        }
      });
    }
  });
});




// edit page rendering


app.get("/edit", function (req, res) {
  if (req.isAuthenticated()) {
    if (req.user.username === process.env.ADMIN) {
      activePage = ["", "", ""];

      Content.find({}, function(err, foundContent){
        if (err) {
          console.log(err);
        } else {
          res.render('edit', {
            activePage: activePage,
            mhe: foundContent[0],
            nhe: foundContent[1],
            omhe: foundContent[2],
            she: foundContent[3],
            suhe: foundContent[4],
            fhe: foundContent[5],
            auhe: foundContent[6]
          });
        }
      });
    }
  } else {
    res.redirect("/failed");
  }
});


// edit page post function

app.post("/save", function(req, res){
  Content.updateOne({name:"sudhe"}, {title: req.body.successTitle}, function (err) {
  if (err) {
    console.log(err);
  } else {
    res.redirect("/success")
  }    
  });
});


// epk page rendering

app.get("/epk", function (req, res) {
  if (req.isAuthenticated()) {
    activePage = ["", "", ""];
    res.render("epk", {
      activePage: activePage,
    });
  } else {
    res.redirect("/failed");
  }
});


//logout function

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started successfully on port 3000");
});
