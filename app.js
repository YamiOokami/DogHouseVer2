require("dotenv").config();
const express = require("express");
const https = require ("https");
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
{ name: "mdhe", title: "אנחנו דוגהאוס!", paragraph: "אנחנו להקת רוק שאוהבת לעשות שטויות כמו לכתוב טקסט שממלא חלקים באתר!", link: "https://www.youtube.com/embed/Et4DdBYj7vg"},
{ name: "ndhe", title: "רוצים להיות תמיד מעודכנים? הרשמו לניוזלטר שלנו"},
{ name: "omdhe", title: "המוזיקה שלנו", link:"https://www.youtube.com/embed/videoseries?list=PLU5G0w5zZI6IgNqgWMdoaAwrwDnv9EUx7", link1:"https://open.spotify.com/embed/playlist/03LxLFhUbx4VzUyFUXy34A"},
{ name: "sdhe", title: "הופעות קרובות", paragraph: "הופעה בלבונטין בתאריך ככה ובשעה ככה", paragraph1: "הופעה במאדים בתאריך שכזה ושעה שכזו", paragraph2: "הופעה שהיא הופעה שכזו וכאלה", paragraph3: "הופעה משותפת עם החתולים הסמוראיים", paragraph4: "סיבוב הופעות מסביב לעולם ב 80 יום", link:"#", link1:"#", link2:"#", link3:"#", link4:"#"},
{ name: "sudhe", title: "בקשתך התקבלה בהצלחה"},
{ name: "fdhe", title: "משהו השתבש...", paragraph: "נראה שמשהו השתבש ובקשתך לא התקבלה. אנא נסה שנית מאוחר יותר"},
{ name: "audhe", title: "אז מי אנחנו בכלל?", paragraph:"משהו על זה שאנחנו חברים מהמרכז שהחליטו להקים להקה וכדומה"},
{ name: "mhel", title: "", paragraph: "", link:""},
{ name: "nhel", title: ""},
{ name: "omhel", title: "", link:"", link1:""},
{ name: "shel", title : "", paragraph: "", paragraph1: "", paragraph2: "", paragraph3: "", paragraph4: "", link: "", link1: "", link2: "", link3: "", link4: ""},
{ name: "suhel", title: ""},
{ name: "fhel", title: "", paragraph: ""},
{ name: "auhel", title: "", paragraph:""},
{ name: "mhe", title: "אנחנו דוגהאוס!", paragraph: "אנחנו להקת רוק שאוהבת לעשות שטויות כמו לכתוב טקסט שממלא חלקים באתר!", link: "https://www.youtube.com/embed/Et4DdBYj7vg"},
{ name: "nhe",  title: "רוצים להיות תמיד מעודכנים? הרשמו לניוזלטר שלנו"},
{ name: "omhe", title: "המוזיקה שלנו", link:"https://www.youtube.com/embed/videoseries?list=PLU5G0w5zZI6IgNqgWMdoaAwrwDnv9EUx7", link1:"https://open.spotify.com/embed/playlist/03LxLFhUbx4VzUyFUXy34A"},
{ name: "she", title: "הופעות קרובות", paragraph: "הופעה בלבונטין בתאריך ככה ובשעה ככה", paragraph1: "הופעה במאדים בתאריך שכזה ושעה שכזו", paragraph2: "הופעה שהיא הופעה שכזו וכאלה", paragraph3: "הופעה משותפת עם החתולים הסמוראיים", paragraph4: "סיבוב הופעות מסביב לעולם ב 80 יום", link:"#", link1:"#", link2:"#", link3:"#", link4:"#"},
{ name: "suhe", title: "בקשתך התקבלה בהצלחה"},
{ name: "fhe", title: "משהו השתבש...", paragraph: "נראה שמשהו השתבש ובקשתך לא התקבלה. אנא נסה שנית מאוחר יותר"},
{ name: "auhe", title: "אז מי אנחנו בכלל?", paragraph:"משהו על זה שאנחנו חברים מהמרכז שהחליטו להקים להקה וכדומה"},
{ name : "mden", title : "We are DogHouse!", "paragraph" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et sollicitudin massa.", link: "https://www.youtube.com/embed/Et4DdBYj7vg"},
{ name : "nden", title : "Want to stay updated? Sign up for our newsletter"},
{ name : "omden", title : "Our Music", link:"https://www.youtube.com/embed/videoseries?list=PLU5G0w5zZI6IgNqgWMdoaAwrwDnv9EUx7", link1:"https://open.spotify.com/embed/playlist/03LxLFhUbx4VzUyFUXy34A"},
{ name : "sden", title : "Upcoming Shows", "paragraph" : "Lorem ipsum dolor sit amet, consectetur.", "paragraph1" : "Lorem ipsum dolor sit amet, consectetur.", "paragraph2" : "Lorem ipsum dolor sit amet, consectetur.", "paragraph3" : "Lorem ipsum dolor sit amet, consectetur.", "paragraph4" : "Lorem ipsum dolor sit amet, consectetur.", "link" : "#", "link1" : "#", "link2" : "#", "link3" : "#", "link4" : "#"},
{ name : "suden", title : "Your request was successfully submitted"},
{ name : "fden", title : "Something went wrong", "paragraph" : "Please try again later"},
{ name : "auden", title : "About Us", "paragraph" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat nibh vel orci bibendum, posuere tempus mi vulputate. Duis gravida eu felis et auctor. Vestibulum eu turpis eget ante varius finibus vitae ut nunc. Nam quis blandit lacus. Donec consectetur odio et justo placerat, id scelerisque orci fermentum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque nec nisi eget ipsum sollicitudin fermentum. Aliquam nec sapien sed risus semper venenatis. Praesent congue porta egestas. Sed blandit feugiat lorem. Quisque in diam lacus."},
{ name : "menl", title : "", "paragraph" : ""},
{ name : "nenl", title : ""},
{ name : "omenl", title : ""},
{ name : "senl", title : "", "paragraph" : "", "paragraph1" : "", "paragraph2" : "", "paragraph3" : "", "paragraph4" : "", "link" : "#", "link1" : "#", "link2" : "#", "link3" : "#", "link4" : "#"},
{ name : "suenl", title : ""},
{ name : "fenl", title : "", "paragraph" : ""},
{ name : "auenl", title : "", "paragraph" : ""},
{ name : "men", title : "We are DogHouse!", "paragraph" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et sollicitudin massa.", link: "https://www.youtube.com/embed/Et4DdBYj7vg"},
{ name : "nen", title : "Want to stay updated? Sign up for our newsletter"},
{ name : "omen", title : "Our Music", link:"https://www.youtube.com/embed/videoseries?list=PLU5G0w5zZI6IgNqgWMdoaAwrwDnv9EUx7", link1:"https://open.spotify.com/embed/playlist/03LxLFhUbx4VzUyFUXy34A"},
{ name : "sen", title : "Upcoming Shows", "paragraph" : "Lorem ipsum dolor sit amet, consectetur.", "paragraph1" : "Lorem ipsum dolor sit amet, consectetur.", "paragraph2" : "Lorem ipsum dolor sit amet, consectetur.", "paragraph3" : "Lorem ipsum dolor sit amet, consectetur.", "paragraph4" : "Lorem ipsum dolor sit amet, consectetur.", "link" : "#", "link1" : "#", "link2" : "#", "link3" : "#", "link4" : "#"},
{ name : "suen", title : "Your request was successfully submitted"},
{ name : "fen", title : "Something went wrong", "paragraph" : "Please try again later"},
{ name : "auen", title : "About Us", "paragraph" : ""}
    ]);
    console.log("Found no data in the DB and created the default data");
  } else {
    console.log("No need to create default content, you are good to go :)");
  }
});

//main variable for language

let lang = "he";

// main variable for logged in

let loggedInUser = "";

// main variable for the activated page

let activePage = [];

const editpageHeb = ["mhe", "nhe", "omhe", "she","suhe","fhe","auhe"];

const editpageEng = ["men", "nen", "omen", "sen","suen","fen","auen"];

const mainPageHeb = ["mhe", "nhe", "omhe", "she"];

const mainPageEng = ["men", "nen", "omen", "sen"];

const aboutPageHeb = ["auhe"];

const aboutPageEng = ["auen"];

const successPageHeb = ["suhe"];

const successPageEng = ["suen"];

const failedPageHeb = ["fhe"];

const failedPageEng = ["fen"];

function findContent(itemsToFind) {
  if (itemsToFind.length === 1) {
    let dataFound = Content.findOne({
      name: itemsToFind
    });
    return dataFound;
  } else {
    let dataFound = Content.find({
      name: { $in: itemsToFind}
    }); 
    return dataFound;
  }
}

// main page rendering

app.get("/", function (req, res) {
  activePage = [];
  activePage[0] = "active";
  if (lang === "en") {
    let query = findContent(mainPageEng);
    query.exec(function (err, foundContent) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
        res.render('main', {
          lang: lang,
          loggedInUser: loggedInUser,
          activePage: activePage,
          // section content
          //main section content
          main: foundContent[0],
          //newsletter content
          news: foundContent[1],
          //our music content
          ourmusic: foundContent[2],
          //shows content
          shows: foundContent[3]
        });
      }
    });
  } else {
    let query = findContent(mainPageHeb);
    query.exec(function (err, foundContent) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
        res.render('main', {
          lang: lang,
          loggedInUser: loggedInUser,
          activePage: activePage,
          // section content
          //main section content
          main: foundContent[0],
          //newsletter content
          news: foundContent[1],
          //our music content
          ourmusic: foundContent[2],
          //shows content
          shows: foundContent[3]
        });
      }
    });
  }
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
          loggedInUser = "admin";
          res.redirect("/edit");
        } else if (user.username === process.env.EPK) {
            loggedInUser = "epk";
            res.redirect("/epk");  
        } else {
          res.redirect("/");
        }
      });
    }
  });
});


// change language function

app.post("/lang", function(req ,res) {
  if (lang === "en") {
    lang = "he";
    res.redirect("/");
  } else {
    lang = "en";
    res.redirect("/");
  }
});


// newslatter function
/* 
app.post("/news", function (req, res) {
  const fisrName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fistName,
          LNAME: lastName
        }
      }
    ]
  };

const jasonData = JASON.stringify(data);

// needs url from mailchimp
const url = "https://us7.api.mailchimp.com/3.0/lists/<list-id>"

const options = {
  method: "POST",

  // needs auth key from mailchimp
  auth: "doghouseband7:<api-key>"
}

const request = https.request(url, options, function(response){
  if (response.statusCode === 200) {
    res.redirect("/success");
  } else {
    res.redirect("/failed");
  }

  response.on("data", function(data){
    console.log(JASON.parse(data));
  });

});

  request.write(jasonData);
  request.end()

}); */


// contact page rendering

app.get("/contact", function (req, res) {
  activePage = [];
  activePage[1] = "active";
  res.render("contact", {
    activePage: activePage,
    loggedInUser: loggedInUser,
    lang: lang
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

// about page rendering

app.get("/about", function (req, res) {
  activePage = [];
  activePage[2] ="active";

  if (lang === "en") {
    let query = findContent(aboutPageEng);
    query.exec(function (err, foundContent) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
        res.render("about", {
          activePage: activePage,
          lang: lang,
          loggedInUser: loggedInUser,
          aboutus: foundContent
        });  
      }
    });    
  } else {
    let query = findContent(aboutPageHeb);
    query.exec(function (err, foundContent) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
        res.render("about", {
          activePage: activePage,
          lang: lang,
          loggedInUser: loggedInUser,
          aboutus: foundContent
        });  
      }
    });
  }
});


//sucess page rendering

app.get('/success', function (req, res) {
  activePage = [];

  // finding the specific title I'm looking for and showing it in the page

  if (lang === "en") {
    let query = findContent(successPageEng);
    query.exec(function (err, foundContent) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
        res.render('success', {
          activePage: activePage,
          lang: lang,
          loggedInUser: loggedInUser,
          success: foundContent
        });
      }
    });
  } else {
    let query = findContent(successPageHeb);
    query.exec(function (err, foundContent) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
        res.render('success', {
          activePage: activePage,
          lang: lang,
          loggedInUser: loggedInUser,
          success: foundContent
        });
      }
    });
  }
});

//failed page rendring

app.get('/failed', function (req, res) {
  activePage = [];

  if (lang === "en") {
    let query = findContent(failedPageEng);
    query.exec(function(err, foundContent) {
      if (err) {
        console.log(err);
        res.redirect("/");
      } else {
        res.render('failed', {
          activePage: activePage,
          lang: lang,
          loggedInUser: loggedInUser,
          failed: foundContent
        });
      }
    });
  } else {
    let query = findContent(failedPageHeb);
    query.exec(function(err, foundContent) {
      if (err) {
        console.log(err);
        res.redirect("/");
      } else {
        res.render('failed', {
          activePage: activePage,
          lang: lang,
          loggedInUser: loggedInUser,
          failed: foundContent
        });
      }
    });
  }
});

// edit page rendering


app.get("/edit", function (req, res) {
  if (req.isAuthenticated()) {
    if (req.user.username === process.env.ADMIN) {
      activePage = [];
      activePage[4] = "active";
      if (lang === "en") {
        let query = findContent(editpageEng);
        query.exec(function (err, foundContent) {
          if (err) {
            console.log(err);
            res.redirect("/failed");
          } else {
            res.render('edit', {
              activePage: activePage,
              lang: lang,
              loggedInUser: loggedInUser,
              main: foundContent[0],
              news: foundContent[1],
              ourmusic: foundContent[2],
              shows: foundContent[3],
              success: foundContent[4],
              failed: foundContent[5],
              aboutus: foundContent[6]
            });
          }
        });
      } else {
        let query = findContent(editpageHeb);
        query.exec(function(err, foundContent) {
          if (err) {
            console.log(err);
            res.redirect("/failed")
          } else {
            res.render('edit', {
              activePage: activePage,
              lang: lang,
              loggedInUser: loggedInUser,
              main: foundContent[0],
              news: foundContent[1],
              ourmusic: foundContent[2],
              shows: foundContent[3],
              success: foundContent[4],
              failed: foundContent[5],
              aboutus: foundContent[6]
            });
          }
        });
      }
    } else {
      res.redirect("/failed");
    } 
      }
});


// edit page update the database function

app.post("/save", function(req, res){  
 
//get current fields data & update last modified fields

if (lang === "en") {
  Content.find({
    name: { $in: ["men", "nen", "omen", "sen", "suen", "fen", "auen"]}
   }, function (err, foundContent) {
    if (err) {
      console.log(err);
      res.redirect("/failed");
    } else {
      Content.bulkWrite([
        { updateOne:
          {
            "filter": {"name": "menl"},
            "update": {
              "title": foundContent[0].title,
              "paragraph": foundContent[0].paragraph,
              "link": foundContent[0].link
            }
          }
        }, {
          updateOne: {
            "filter": {"name" : "nenl"},
            "update": {
              "title": foundContent[1].title
            }
          }
        }, {
          updateOne: {
            "filter": {"name" : "omenl"},
            "update": {
              "title": foundContent[2].title,
              "link": foundContent[2].link,
              "link1": foundContent[2].link1
            }
          }
        }, {
          updateOne: {
            "filter": {"name" : "senl"},
            "update": {
              "title": foundContent[3].title,
              "paragraph": foundContent[3].paragraph,
              "paragraph1": foundContent[3].paragraph1,
              "paragraph2": foundContent[3].paragraph2,
              "paragraph3": foundContent[3].paragraph3,
              "paragraph4": foundContent[3].paragraph4,
              "link": foundContent[3].link,
              "link1": foundContent[3].link1,
              "link2": foundContent[3].link2,
              "link3": foundContent[3].link3,
              "link4": foundContent[3].link4
            }
          }
        }, {
          updateOne: {
            "filter": {"name" : "suenl"},
            "update": {
              "title": foundContent[4].title
            }
          }
        } , {
          updateOne: {
            "filter": {"name" : "fenl"},
            "update": {
              "title": foundContent[5].title,
              "paragraph": foundContent[5].paragraph
            }
          }
        } , {
          updateOne: {
            "filter": {"name" : "auenl"},
            "update": {
              "title": foundContent[6].title,
              "paragraph": foundContent[6].paragraph
            }
          }
        },
        // update all of the fields that that's been changed in the edit page in the db
        { updateOne:
          {
            "filter": {"name" : "men"},
            "update": {
              "title": req.body.mainTitle,
              "paragraph": req.body.mainPara,
              "link": req.body.mainLink
            }
          }
          }, {
            updateOne: {
              "filter": {"name" : "nen"},
              "update": {
                "title": req.body.newslatterTitle
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "omen"},
              "update": {
                "title": req.body.ourmusicTitle,
                "link": req.body.ourmusicLink,
                "link1": req.body.ourmusicLink1
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "sen"},
              "update": {
                "title": req.body.showsTitle,
                "paragraph": req.body.showsPara,
                "paragraph1": req.body.showsPara1,
                "paragraph2": req.body.showsPara2,
                "paragraph3": req.body.showsPara3,
                "paragraph4": req.body.showsPara4,
                "link": req.body.showsLink,
                "link2": req.body.showsLink2,
                "link3": req.body.showsLink3,
                "link4": req.body.showsLink4
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "suen"},
              "update": {
                "title": req.body.successTitle
              }
            }
          } , {
            updateOne: {
              "filter": {"name" : "fen"},
              "update": {
                "title": req.body.failTitle,
                "paragraph": req.body.failPara
              }
            }
          } , {
            updateOne: {
              "filter": {"name" : "auen"},
              "update": {
                "title": req.body.aboutTitle,
                "paragraph": req.body.aboutPara
              }
            }
          }
      ], function (err) {
        if (err) {
          console.log(err);
          res.redirect("/failed")
        } else {
          res.redirect("/success")
        }
      });
    }
    });
} else {
  //find Hebrew values and update them
  Content.find({
    name: { $in: ["mhe", "nhe", "omhe", "she", "suhe", "fhe", "auhe"]}
   }, function (err, foundContent) {
    if (err) {
      console.log(err);
      res.redirect("/failed");
    } else {
      Content.bulkWrite([
        { updateOne:
          {
            "filter": {"name": "mhel"},
            "update": {
              "title": foundContent[0].title,
              "paragraph": foundContent[0].paragraph,
              "link": foundContent[0].link
            }
          }
        }, {
          updateOne: {
            "filter": {"name" : "nhel"},
            "update": {
              "title": foundContent[1].title
            }
          }
        }, {
          updateOne: {
            "filter": {"name" : "omhel"},
            "update": {
              "title": foundContent[2].title,
              "link": foundContent[2].link,
              "link1": foundContent[2].link1
            }
          }
        }, {
          updateOne: {
            "filter": {"name" : "shel"},
            "update": {
              "title": foundContent[3].title,
              "paragraph": foundContent[3].paragraph,
              "paragraph1": foundContent[3].paragraph1,
              "paragraph2": foundContent[3].paragraph2,
              "paragraph3": foundContent[3].paragraph3,
              "paragraph4": foundContent[3].paragraph4,
              "link": foundContent[3].link,
              "link1": foundContent[3].link1,
              "link2": foundContent[3].link2,
              "link3": foundContent[3].link3,
              "link4": foundContent[3].link4
            }
          }
        }, {
          updateOne: {
            "filter": {"name" : "suhel"},
            "update": {
              "title": foundContent[4].title
            }
          }
        } , {
          updateOne: {
            "filter": {"name" : "fhel"},
            "update": {
              "title": foundContent[5].title,
              "paragraph": foundContent[5].paragraph
            }
          }
        } , {
          updateOne: {
            "filter": {"name" : "auhel"},
            "update": {
              "title": foundContent[6].title,
              "paragraph": foundContent[6].paragraph
            }
          }
        },
        // update all of the fields that that's been changed in the edit page in the db
        { updateOne:
          {
            "filter": {"name" : "mhe"},
            "update": {
              "title": req.body.mainTitle,
              "paragraph": req.body.mainPara,
              "link": req.body.mainLink
            }
          }
          }, {
            updateOne: {
              "filter": {"name" : "nhe"},
              "update": {
                "title": req.body.newslatterTitle
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "omhe"},
              "update": {
                "title": req.body.ourmusicTitle,
                "link": req.body.ourmusicLink,
                "link1": req.body.ourmusicLink1
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "she"},
              "update": {
                "title": req.body.showsTitle,
                "paragraph": req.body.showsPara,
                "paragraph1": req.body.showsPara1,
                "paragraph2": req.body.showsPara2,
                "paragraph3": req.body.showsPara3,
                "paragraph4": req.body.showsPara4,
                "link": req.body.showsLink,
                "link2": req.body.showsLink2,
                "link3": req.body.showsLink3,
                "link4": req.body.showsLink4
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "suhe"},
              "update": {
                "title": req.body.successTitle
              }
            }
          } , {
            updateOne: {
              "filter": {"name" : "fhe"},
              "update": {
                "title": req.body.failTitle,
                "paragraph": req.body.failPara
              }
            }
          } , {
            updateOne: {
              "filter": {"name" : "auhe"},
              "update": {
                "title": req.body.aboutTitle,
                "paragraph": req.body.aboutPara
              }
            }
          }
      ], function (err) {
        if (err) {
          console.log(err);
          res.redirect("/failed")
        } else {
          res.redirect("/success")
        }
      });
    }
    });
}
});

//restore last edit

app.post("/lastmod", function (req, res){
  if (lang === "en") {
    Content.find({
      name: { $in: ["menl", "nenl", "omenl", "senl", "suenl", "fenl", "auenl"]}
     }, function (err, foundContent) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
        Content.bulkWrite([
          { updateOne:
            {
              "filter": {"name": "men"},
              "update": {
                "title": foundContent[0].title,
                "paragraph": foundContent[0].paragraph,
                "link": foundContent[0].link
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "nen"},
              "update": {
                "title": foundContent[1].title
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "omen"},
              "update": {
                "title": foundContent[2].title,
                "link": foundContent[2].link,
                "link1": foundContent[2].link1
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "sen"},
              "update": {
                "title": foundContent[3].title,
                "paragraph": foundContent[3].paragraph,
                "paragraph1": foundContent[3].paragraph1,
                "paragraph2": foundContent[3].paragraph2,
                "paragraph3": foundContent[3].paragraph3,
                "paragraph4": foundContent[3].paragraph4,
                "link": foundContent[3].link,
                "link1": foundContent[3].link1,
                "link2": foundContent[3].link2,
                "link3": foundContent[3].link3,
                "link4": foundContent[3].link4
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "suen"},
              "update": {
                "title": foundContent[4].title
              }
            }
          } , {
            updateOne: {
              "filter": {"name" : "fen"},
              "update": {
                "title": foundContent[5].title,
                "paragraph": foundContent[5].paragraph
              }
            }
          } , {
            updateOne: {
              "filter": {"name" : "auen"},
              "update": {
                "title": foundContent[6].title,
                "paragraph": foundContent[6].paragraph
              }
            }
          }
        ], function (err) {
          if (err) {
            console.log(err);
            res.redirect("/failed")
          } else {
            res.redirect("/success")
          }
        });
      }
      });
  } else {
    Content.find({
      name: { $in: ["mhel", "nhel", "omhel", "shel", "suhel", "fhel", "auhel"]}
     }, function (err, foundContent) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
        Content.bulkWrite([
          { updateOne:
            {
              "filter": {"name": "mhe"},
              "update": {
                "title": foundContent[0].title,
                "paragraph": foundContent[0].paragraph,
                "link": foundContent[0].link
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "nhe"},
              "update": {
                "title": foundContent[1].title
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "omhe"},
              "update": {
                "title": foundContent[2].title,
                "link": foundContent[2].link,
                "link1": foundContent[2].link1
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "she"},
              "update": {
                "title": foundContent[3].title,
                "paragraph": foundContent[3].paragraph,
                "paragraph1": foundContent[3].paragraph1,
                "paragraph2": foundContent[3].paragraph2,
                "paragraph3": foundContent[3].paragraph3,
                "paragraph4": foundContent[3].paragraph4,
                "link": foundContent[3].link,
                "link1": foundContent[3].link1,
                "link2": foundContent[3].link2,
                "link3": foundContent[3].link3,
                "link4": foundContent[3].link4
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "suhe"},
              "update": {
                "title": foundContent[4].title
              }
            }
          } , {
            updateOne: {
              "filter": {"name" : "fhe"},
              "update": {
                "title": foundContent[5].title,
                "paragraph": foundContent[5].paragraph
              }
            }
          } , {
            updateOne: {
              "filter": {"name" : "auhe"},
              "update": {
                "title": foundContent[6].title,
                "paragraph": foundContent[6].paragraph
              }
            }
          }
        ], function (err) {
          if (err) {
            console.log(err);
            res.redirect("/failed")
          } else {
            res.redirect("/success")
          }
        });
      }
      }); 
  }
});

// restore default values

app.post("/default", function(req, res){

  if (lang === "en") {
    Content.find({
      name: { $in: ["mden", "nden", "omden", "sden", "suden", "fden", "auden"]}
     }, function (err, foundContent) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
        Content.bulkWrite([
          { updateOne:
            {
              "filter": {"name": "men"},
              "update": {
                "title": foundContent[0].title,
                "paragraph": foundContent[0].paragraph,
                "link": foundContent[0].link
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "nen"},
              "update": {
                "title": foundContent[1].title
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "omen"},
              "update": {
                "title": foundContent[2].title,
                "link": foundContent[2].link,
                "link1": foundContent[2].link1
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "sen"},
              "update": {
                "title": foundContent[3].title,
                "paragraph": foundContent[3].paragraph,
                "paragraph1": foundContent[3].paragraph1,
                "paragraph2": foundContent[3].paragraph2,
                "paragraph3": foundContent[3].paragraph3,
                "paragraph4": foundContent[3].paragraph4,
                "link": foundContent[3].link,
                "link1": foundContent[3].link1,
                "link2": foundContent[3].link2,
                "link3": foundContent[3].link3,
                "link4": foundContent[3].link4
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "suen"},
              "update": {
                "title": foundContent[4].title
              }
            }
          } , {
            updateOne: {
              "filter": {"name" : "fen"},
              "update": {
                "title": foundContent[5].title,
                "paragraph": foundContent[5].paragraph
              }
            }
          } , {
            updateOne: {
              "filter": {"name" : "auen"},
              "update": {
                "title": foundContent[6].title,
                "paragraph": foundContent[6].paragraph
              }
            }
          }
        ], function (err) {
          if (err) {
            console.log(err);
            res.redirect("/failed")
          } else {
            res.redirect("/success")
          }
        });
      }
      });
  } else {
    Content.find({
      name: { $in: ["mdhe", "ndhe", "omdhe", "sdhe", "sudhe", "fdhe", "audhe"]}
     }, function (err, foundContent) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
        Content.bulkWrite([
          { updateOne:
            {
              "filter": {"name": "mhe"},
              "update": {
                "title": foundContent[0].title,
                "paragraph": foundContent[0].paragraph,
                "link": foundContent[0].link
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "nhe"},
              "update": {
                "title": foundContent[1].title
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "omhe"},
              "update": {
                "title": foundContent[2].title,
                "link": foundContent[2].link,
                "link1": foundContent[2].link1
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "she"},
              "update": {
                "title": foundContent[3].title,
                "paragraph": foundContent[3].paragraph,
                "paragraph1": foundContent[3].paragraph1,
                "paragraph2": foundContent[3].paragraph2,
                "paragraph3": foundContent[3].paragraph3,
                "paragraph4": foundContent[3].paragraph4,
                "link": foundContent[3].link,
                "link1": foundContent[3].link1,
                "link2": foundContent[3].link2,
                "link3": foundContent[3].link3,
                "link4": foundContent[3].link4
              }
            }
          }, {
            updateOne: {
              "filter": {"name" : "suhe"},
              "update": {
                "title": foundContent[4].title
              }
            }
          } , {
            updateOne: {
              "filter": {"name" : "fhe"},
              "update": {
                "title": foundContent[5].title,
                "paragraph": foundContent[5].paragraph
              }
            }
          } , {
            updateOne: {
              "filter": {"name" : "auhe"},
              "update": {
                "title": foundContent[6].title,
                "paragraph": foundContent[6].paragraph
              }
            }
          }
        ], function (err) {
          if (err) {
            console.log(err);
            res.redirect("/failed")
          } else {
            res.redirect("/success")
          }
        });
      }
      }); 
  }
});

// epk page rendering

app.get("/epk", function (req, res) {
  if (req.isAuthenticated()) {
    activePage = [];
    activePage[3] = "active";
    res.render("epk", {
      activePage: activePage,
      lang: lang,
      loggedInUser: loggedInUser
    });
  } else {
    res.redirect("/failed");
  }
});


//logout function

app.post("/logout", function (req, res) {
  req.logout();
  loggedInUser = "";
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started successfully on port 3000");
});
