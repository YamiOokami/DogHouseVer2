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
const fs = require("fs");
const path = require("path");
const multer = require("multer");


const app = express();

// multer initialization

// defining the storage place for the images
const storage = multer.diskStorage({
  //destination for the files
  destination: (req, file, cb) => {
    cb(null, './public/uploads/images');
  },
  //defining how the files will be named
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

//upload parameters for multer
const upload = multer({
  storage: storage
});

//node mailer initialization

let transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "doghouseband7@gmail.com",
    pass: "Allwoodhomo7",
  },
});

// ejs initialization

app.set("view engine", "ejs");

//body parser initizlization

app.use(
  bodyParser.urlencoded({
    extended: true
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
mongoose.connect("mongodb+srv://admin-sela:" +  process.env.DB_PASS + "@doghouse.25dj0.mongodb.net/doghouseDB?retryWrites=true&w=majority", {
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

const imageSchema = new mongoose.Schema({
  img: String
});


const epkSchema = new mongoose.Schema({
  name: String,
  content: String
});

userSchema.plugin(passportLocalMongoose);

//mongoose models

const Content = new mongoose.model("Content", contentSchema);
const User = new mongoose.model("User", userSchema);
const Image = new mongoose.model("Image", imageSchema);
const Epk = new mongoose.model("Epk",epkSchema);

//initilizing passport

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// check if there is no data in the db and create the default content if there is none

Content.find({ }, function (err, foundContent) {
  if (foundContent.length === 0) {
    Content.insertMany([
{ name: "mdhe", title: "אנחנו דוגהאוס!", paragraph: "אנחנו להקת רוק שאוהבת לעשות שטויות כמו לכתוב טקסט שממלא חלקים באתר!", link: "https://www.youtube.com/embed/Et4DdBYj7vg", link1: "#", link2: "#", link3: "#"},
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
{ name: "mhe", title: "אנחנו דוגהאוס!", paragraph: "אנחנו להקת רוק שאוהבת לעשות שטויות כמו לכתוב טקסט שממלא חלקים באתר!", link: "https://www.youtube.com/embed/Et4DdBYj7vg", link1: "#", link2: "#", link3: "#"},
{ name: "nhe",  title: "רוצים להיות תמיד מעודכנים? הרשמו לניוזלטר שלנו"},
{ name: "omhe", title: "המוזיקה שלנו", link:"https://www.youtube.com/embed/videoseries?list=PLU5G0w5zZI6IgNqgWMdoaAwrwDnv9EUx7", link1:"https://open.spotify.com/embed/playlist/03LxLFhUbx4VzUyFUXy34A"},
{ name: "she", title: "הופעות קרובות", paragraph: "הופעה בלבונטין בתאריך ככה ובשעה ככה", paragraph1: "הופעה במאדים בתאריך שכזה ושעה שכזו", paragraph2: "הופעה שהיא הופעה שכזו וכאלה", paragraph3: "הופעה משותפת עם החתולים הסמוראיים", paragraph4: "סיבוב הופעות מסביב לעולם ב 80 יום", link:"#", link1:"#", link2:"#", link3:"#", link4:"#"},
{ name: "suhe", title: "בקשתך התקבלה בהצלחה"},
{ name: "fhe", title: "משהו השתבש...", paragraph: "נראה שמשהו השתבש ובקשתך לא התקבלה. אנא נסה שנית מאוחר יותר"},
{ name: "auhe", title: "אז מי אנחנו בכלל?", paragraph:"משהו על זה שאנחנו חברים מהמרכז שהחליטו להקים להקה וכדומה"},
{ name : "mden", title : "We are DogHouse!", "paragraph" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et sollicitudin massa.", link: "https://www.youtube.com/embed/Et4DdBYj7vg", link1: "#", link2: "#", link3: "#"},
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
{ name : "men", title : "We are DogHouse!", "paragraph" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et sollicitudin massa.", link: "https://www.youtube.com/embed/Et4DdBYj7vg", link1: "#", link2: "#", link3: "#"},
{ name : "nen", title : "Want to stay updated? Sign up for our newsletter"},
{ name : "omen", title : "Our Music", link:"https://www.youtube.com/embed/videoseries?list=PLU5G0w5zZI6IgNqgWMdoaAwrwDnv9EUx7", link1:"https://open.spotify.com/embed/playlist/03LxLFhUbx4VzUyFUXy34A"},
{ name : "sen", title : "Upcoming Shows", "paragraph" : "Lorem ipsum dolor sit amet, consectetur.", "paragraph1" : "Lorem ipsum dolor sit amet, consectetur.", "paragraph2" : "Lorem ipsum dolor sit amet, consectetur.", "paragraph3" : "Lorem ipsum dolor sit amet, consectetur.", "paragraph4" : "Lorem ipsum dolor sit amet, consectetur.", "link" : "#", "link1" : "#", "link2" : "#", "link3" : "#", "link4" : "#"},
{ name : "suen", title : "Your request was successfully submitted"},
{ name : "fen", title : "Something went wrong", "paragraph" : "Please try again later"},
{ name : "auen", title : "About Us", "paragraph" : ""}
    ]);
    console.log("Found no data in the DB and created the default data.");
  } else {
    console.log("No need to create default content.");
  }
});

// Create default users if needed

User.find({}, function (err, foundUsers) {
  if (foundUsers.length === 0) {
    User.insertMany([
      {
        "username" : process.env.ADMIN,
        "salt" : process.env.ADMIN_SALT,
        "hash" : process.env.ADMIN_HASH
      },
      {
        "username" : process.env.EPK,
        "salt" : process.env.EPK_SALT,
        "hash" : process.env.EPK_HASH
      }
    ]);
    console.log("Found no users in the DB and created the default ones.");
  } else {
    console.log("No need to create default users.");
  }
})


// create EPK data if needed

Epk.find({}, function (err, foundEpk) {
  if (foundEpk.length === 0) {
    Epk.insertMany([
      {name: "epken", content:""},
      {name: "epkheb", content: ""}
    ]);
    console.log("Found no content in for the EPK page and created the default data.");
  } else {
    console.log("No need to create default content for the EPK page.");
  }
});



//main variable for language

let lang = "he";

// main variable for logged in

let loggedInUser = "";

// main variable for the activated page

let activePage = [];

const editPageHeb = ["mhe", "nhe", "omhe", "she","suhe","fhe","auhe"];

const editPageEng = ["men", "nen", "omen", "sen","suen","fen","auen"];

const mainPageHeb = ["mhe", "nhe", "omhe", "she"];

const mainPageEng = ["men", "nen", "omen", "sen"];

const aboutPageHeb = ["auhe"];

const aboutPageEng = ["auen"];

const successPageHeb = ["suhe"];

const successPageEng = ["suen"];

const failedPageHeb = ["fhe"];

const failedPageEng = ["fen"];

let pageToEdit = "";

// function to find items in the DB.
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

app.get("/", async function (req, res) {
  activePage = [];
  activePage[0] = "active";
  let images = await Image.find({});
  if (lang === "en") {
    let mainPageEngCont = await findContent(mainPageEng);
    if (mainPageEngCont) {
      res.render('main', {
        lang: lang,
        loggedInUser: loggedInUser,
        activePage: activePage,
        // section content
        //main section content
        main: mainPageEngCont[0],
        //newsletter content
        news: mainPageEngCont[1],
        //our music content
        ourmusic: mainPageEngCont[2],
        //shows content
        shows: mainPageEngCont[3],
        images: images
      });
    } else {
      console.log(err);
      res.redirect("/failed");
    }
  } else {
    let mainPageHebCont = await findContent(mainPageHeb);
    if (mainPageHebCont) {
      res.render('main', {
        lang: lang,
        loggedInUser: loggedInUser,
        activePage: activePage,
        // section content
        //main section content
        main: mainPageHebCont[0],
        //newsletter content
        news: mainPageHebCont[1],
        //our music content
        ourmusic: mainPageHebCont[2],
        //shows content
        shows: mainPageHebCont[3],
        images: images
      });
    } else {
      console.log(err);
      res.redirect("/failed");
    }
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

app.post("/news", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

const jasonData = JSON.stringify(data);

const url = "https://us1.api.mailchimp.com/3.0/lists/" + process.env.NEWS_ID;

const options = {
  method: "POST",

  auth: "doghouseband7:" + process.env.NEWS_API
}

const request = https.request(url, options, function(response){
  if (response.statusCode === 200) {
    res.redirect("/success");
  } else {
    res.redirect("/failed");
  }

  response.on("data", function(data){
    console.log(JSON.parse(data));
  });

});

  request.write(jasonData);
  request.end()

});


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

app.get("/about", async function (req, res) {
  activePage = [];
  activePage[2] ="active";

  if (lang === "en") {
    let aboutPageEngCont = await findContent(aboutPageEng);
    if (aboutPageEngCont) {
      res.render("about", {
        activePage: activePage,
        lang: lang,
        loggedInUser: loggedInUser,
        aboutus: aboutPageEngCont
      });
    } else {
      console.log(err);
      res.redirect("/failed");
    }
  } else {
   let aboutPageHebCont = await findContent (aboutPageHeb);
    if (aboutPageHebCont) {
      res.render("about", {
        activePage: activePage,
        lang: lang,
        loggedInUser: loggedInUser,
        aboutus: aboutPageHebCont
      });  
    } else {
      console.log(err);
      res.redirect("/failed");
    }   
  }
});


//sucess page rendering

app.get('/success', async function (req, res) {
  activePage = [];

  // finding the specific title I'm looking for and showing it in the page

  if (lang === "en") {
    let successPageEngCont = await findContent(successPageEng);
    if (successPageEngCont) {
      res.render('success', {
        activePage: activePage,
        lang: lang,
        loggedInUser: loggedInUser,
        success: successPageEngCont
      });
    } else {
      console.log(err);
      res.redirect("/failed");
    }
  } else {
    let successPageHebCont = await findContent(successPageHeb);
    if (successPageHebCont) {
      res.render('success', {
        activePage: activePage,
        lang: lang,
        loggedInUser: loggedInUser,
        success: successPageHebCont
      });
    } else {
      console.log(err);
      res.redirect("/failed");
    }
  }
});

//failed page rendring

app.get('/failed', async function (req, res) {
  activePage = [];
  if (lang === "en") {
    let failedPageEngCont = await findContent(failedPageEng);
    if (failedPageEngCont) {
      console.log(failedPageEngCont);
      res.render('failed', {
        activePage: activePage,
        lang: lang,
        loggedInUser: loggedInUser,
        failed: failedPageEngCont
      });
    } else {
      console.log(err);
      res.redirect("/");
    }
  } else {
    let failedPageHebCont = await findContent(failedPageHeb);
      if (failedPageHebCont) {
        res.render('failed', {
        activePage: activePage,
        lang: lang,
        loggedInUser: loggedInUser,
        failed: failedPageHebCont
      });
    } else {
      console.log(err);
      res.redirect("/");
    }
  }
});

// edit page rendering


app.get("/edit", async function (req, res) {
  if (req.isAuthenticated()) {
    if (req.user.username === process.env.ADMIN) {
      activePage = [];
      activePage[4] = "active";
      let images = await Image.find({});
      if (lang === "en") {
        let editPageMainEngCont = await findContent(editPageEng);
        let editEpkEngCont = await Epk.findOne({name: "epken"});
        if (editPageMainEngCont) {
          res.render('edit', {
            activePage: activePage,
            lang: lang,
            loggedInUser: loggedInUser,
            main: editPageMainEngCont[0],
            news: editPageMainEngCont[1],
            ourmusic: editPageMainEngCont[2],
            shows: editPageMainEngCont[3],
            success: editPageMainEngCont[4],
            failed: editPageMainEngCont[5],
            aboutus: editPageMainEngCont[6],
            epkcont: editEpkEngCont,
            images: images,
            pageToEdit: pageToEdit
          });
        } else {
          console.log(err);
          res.redirect("/failed");
        }
      } else {
        let editPageMainHebCont = await findContent(editPageHeb);
        let editEpkHebCont = await Epk.findOne({name: "epkheb"});
        if (editPageMainHebCont) {
          res.render('edit', {
            activePage: activePage,
            lang: lang,
            loggedInUser: loggedInUser,
            main: editPageMainHebCont[0],
            news: editPageMainHebCont[1],
            ourmusic: editPageMainHebCont[2],
            shows: editPageMainHebCont[3],
            success: editPageMainHebCont[4],
            failed: editPageMainHebCont[5],
            aboutus: editPageMainHebCont[6],
            epkcont: editEpkHebCont,
            images: images,
            pageToEdit: pageToEdit
          });
        } else {
          console.log(err);
          res.redirect("/failed")
        }
      }
    } else {
      res.redirect("/failed");
    } 
      }
});


// edit page update the database function

// save button function
app.post("/save", upload.single('image') , async function(req, res){  

//get current fields data & update last modified fields

if (lang === "en") {
  
  let foundContent = await findContent(editPageEng);
  if (foundContent) {
    switch (pageToEdit) {
      case "edit-main":
        Content.updateOne({name: "menl"},{
          "title": foundContent[0].title,
           "paragraph": foundContent[0].paragraph,
           "link": foundContent[0].link,
           "link1": foundContent[0].link1,
           "link2": foundContent[0].link2,
           "link3": foundContent[0].link3
   }, function(err) {
     if (err) {
       console.log(err);
       res.redirect("/failed");
     }
   });
    Content.updateOne({name:"men"}, {
      "title": req.body.mainTitle,
      "paragraph": req.body.mainPara,
      "link": req.body.mainLink,
      "link1": req.body.mainLink1,
      "link2": req.body.mainLink2,
      "link3": req.body.mainLink3
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
       res.redirect("/success");
      }
    });
        break;
    case "edit-news":
      Content.updateOne({name: "nenl"},{
        "title": foundContent[1].title
 }, function(err) {
   if (err) {
     console.log(err);
     res.redirect("/failed");
   }
 });
 Content.updateOne({name: "nen"}, {
  "title": req.body.newslatterTitle
 }, function(err) {
  if (err) {
    console.log(err);
    res.redirect("/failed");
  } else {
   res.redirect("/success");
  }
});
    break;
    case "edit-music":
    Content.updateOne({name: "omenl"},{
      "title": foundContent[2].title,
      "link": foundContent[2].link,
      "link1": foundContent[2].link1
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      }
    });
    Content.updateOne({name: "omen"}, {
      "title": req.body.ourmusicTitle,
      "link": req.body.ourmusicLink,
      "link1": req.body.ourmusicLink1
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
       res.redirect("/success");
      }
    });
    break;
    case "edit-shows":
    Content.updateOne({name: "senl"}, {
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
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } 
    });
    Content.updateOne({name: "sen"}, {
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
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
       res.redirect("/success");
      }
    });
    try {
      Image.create({img: req.file.filename});
    } catch (error) {
      console.log("No Image was selected");
    }
    break;
    case "edit-about":
    Content.updateOne({name: "auenl"}, {
      "title": foundContent[6].title,
      "paragraph": foundContent[6].paragraph
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      }
    });
    Content.updateOne({name: "auen"}, {
      "title": req.body.aboutTitle,
      "paragraph": req.body.aboutPara
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
       res.redirect("/success");
      }
    });
    break;
    case "edit-success":
    Content.updateOne({name:"suenl"}, {
      "title": foundContent[4].title
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      }
    });
    Content.updateOne({name: "suen"}, {
      "title": req.body.successTitle
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
       res.redirect("/success");
      }
    });
    break;
    case "edit-fail":
      Content.updateOne({name:"fenl"}, {
        "title": foundContent[5].title,
        "paragraph": foundContent[5].paragraph
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        }
      });
      Content.updateOne({name: "fen"}, {
        "title": req.body.failTitle,
        "paragraph": req.body.failPara
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
         res.redirect("/success");
        }
      });
      break;
      case "edit-epk":
        Epk.updateOne({name: "epken"},{content: req.body.EPK}, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("successfully updated epk content");
            res.redirect("/success");
          }
        });
      break
      default: 
      console.log(err);
      res.redirect("/failed");
        break;
    }
  } else {
    console.log(err + "didn't found any content");
    res.redirect("/failed");
  }
} else {
  //find Hebrew values and update them
  // Save the last modified data in Hebrew to the last edit fields and save the new data to the DB
  let foundContent = await findContent(editPageHeb);
  if (foundContent) {
    switch (pageToEdit) {
      case "edit-main":
        Content.updateOne({name: "mhel"},{
          "title": foundContent[0].title,
           "paragraph": foundContent[0].paragraph,
           "link": foundContent[0].link,
           "link1": foundContent[0].link1,
           "link2": foundContent[0].link2,
           "link3": foundContent[0].link3
   }, function(err) {
     if (err) {
       console.log(err);
       res.redirect("/failed");
     }
   });
    Content.updateOne({name:"mhe"}, {
      "title": req.body.mainTitle,
      "paragraph": req.body.mainPara,
      "link": req.body.mainLink,
      "link1": req.body.mainLink1,
      "link2": req.body.mainLink2,
      "link3": req.body.mainLink3
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
       res.redirect("/success");
      }
    });
        break;
    case "edit-news":
      Content.updateOne({name: "nhel"},{
        "title": foundContent[1].title
 }, function(err) {
   if (err) {
     console.log(err);
     res.redirect("/failed");
   }
 });
 Content.updateOne({name: "nhe"}, {
  "title": req.body.newslatterTitle
 }, function(err) {
  if (err) {
    console.log(err);
    res.redirect("/failed");
  } else {
   res.redirect("/success");
  }
});
    break;
    case "edit-music":
    Content.updateOne({name: "omhel"},{
      "title": foundContent[2].title,
      "link": foundContent[2].link,
      "link1": foundContent[2].link1
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      }
    });
    Content.updateOne({name: "omhe"}, {
      "title": req.body.ourmusicTitle,
      "link": req.body.ourmusicLink,
      "link1": req.body.ourmusicLink1
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
       res.redirect("/success");
      }
    });
    break;
    case "edit-shows":
    Content.updateOne({name: "shel"}, {
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
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } 
    });
    Content.updateOne({name: "she"}, {
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
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
       res.redirect("/success");
      }
    });
    try {
      Image.create({img: req.file.filename});
    } catch (error) {
      console.log("No Image was selected");
    }
    break;
    case "edit-about":
    Content.updateOne({name: "auhel"}, {
      "title": foundContent[6].title,
      "paragraph": foundContent[6].paragraph
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      }
    });
    Content.updateOne({name: "auhe"}, {
      "title": req.body.aboutTitle,
      "paragraph": req.body.aboutPara
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
       res.redirect("/success");
      }
    });
    break;
    case "edit-success":
    Content.updateOne({name:"suhel"}, {
      "title": foundContent[4].title
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      }
    });
    Content.updateOne({name: "suhe"}, {
      "title": req.body.successTitle
    }, function(err) {
      if (err) {
        console.log(err);
        res.redirect("/failed");
      } else {
       res.redirect("/success");
      }
    });
    break;
    case "edit-fail":
      Content.updateOne({name:"fhel"}, {
        "title": foundContent[5].title,
        "paragraph": foundContent[5].paragraph
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        }
      });
      Content.updateOne({name: "fhe"}, {
        "title": req.body.failTitle,
        "paragraph": req.body.failPara
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
         res.redirect("/success");
        }
      });
      break;
      case "edit-epk":
        Epk.updateOne({name: "epkheb"},{content: req.body.EPK}, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("successfully updated epk content");
            res.redirect("/success");
          }
        });
      break
      default: 
      console.log(err);
      res.redirect("/failed");
        break;
    }
  } else {
    console.log(err + "didn't found any content");
    res.redirect("/failed");
  }
}
});
 
//restore last edit

app.post("/lastmod", async function (req, res){
  if (lang === "en") {
    let foundContent = await findContent(["menl", "nenl", "omenl", "senl", "suenl", "fenl", "auenl"]);
    if (foundContent) {
      switch (pageToEdit) {
        case "edit-main":
          Content.updateOne({name: "men"},{
            "title": foundContent[0].title,
             "paragraph": foundContent[0].paragraph,
             "link": foundContent[0].link,
             "link1": foundContent[0].link1,
             "link2": foundContent[0].link2,
             "link3": foundContent[0].link3
     }, function(err) {
       if (err) {
         console.log(err);
         res.redirect("/failed");
       } else {
         res.redirect("/success");
       }
      });
          break;
      case "edit-news":
        Content.updateOne({name: "nen"},{
          "title": foundContent[1].title
   }, function(err) {
     if (err) {
       console.log(err);
       res.redirect("/failed");
     } else {
       res.redirect("/success")
     }
   });
      break;
      case "edit-music":
      Content.updateOne({name: "omen"},{
        "title": foundContent[2].title,
        "link": foundContent[2].link,
        "link1": foundContent[2].link1
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
          res.redirect("/success")
        }
      });
      break;
      case "edit-shows":
      Content.updateOne({name: "sen"}, {
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
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
          res.redirect("/success")
        }
      });
      break;
      case "edit-about":
      Content.updateOne({name: "auen"}, {
        "title": foundContent[6].title,
        "paragraph": foundContent[6].paragraph
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
          res.redirect("/success")
        }
      });
      break;
      case "edit-success":
      Content.updateOne({name:"suen"}, {
        "title": foundContent[4].title
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
          res.redirect("/success")
        }
      });
      break;
      case "edit-fail":
        Content.updateOne({name:"fen"}, {
          "title": foundContent[5].title,
          "paragraph": foundContent[5].paragraph
        }, function(err) {
          if (err) {
            console.log(err);
            res.redirect("/failed");
          } else {
            res.redirect("/success")
          }
        });
        break;
        default: 
        console.log(err);
        res.redirect("/failed");
          break;
      }
    } else {
      console.log(err + "didn't found any content");
      res.redirect("/failed")
    }
  } else {
    let foundContent = await findContent(["mhel", "nhel", "omhel", "shel", "suhel", "fhel", "auhel"]);
    if (foundContent) {
      switch (pageToEdit) {
        case "edit-main":
          Content.updateOne({name: "mhe"},{
            "title": foundContent[0].title,
             "paragraph": foundContent[0].paragraph,
             "link": foundContent[0].link,
             "link1": foundContent[0].link1,
             "link2": foundContent[0].link2,
             "link3": foundContent[0].link3
     }, function(err) {
       if (err) {
         console.log(err);
         res.redirect("/failed");
       } else {
         res.redirect("/success");
       }
      });
          break;
      case "edit-news":
        Content.updateOne({name: "nhe"},{
          "title": foundContent[1].title
   }, function(err) {
     if (err) {
       console.log(err);
       res.redirect("/failed");
     } else {
       res.redirect("/success")
     }
   });
      break;
      case "edit-music":
      Content.updateOne({name: "omhe"},{
        "title": foundContent[2].title,
        "link": foundContent[2].link,
        "link1": foundContent[2].link1
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
          res.redirect("/success")
        }
      });
      break;
      case "edit-shows":
      Content.updateOne({name: "she"}, {
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
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
          res.redirect("/success")
        }
      });
      break;
      case "edit-about":
      Content.updateOne({name: "auhe"}, {
        "title": foundContent[6].title,
        "paragraph": foundContent[6].paragraph
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
          res.redirect("/success")
        }
      });
      break;
      case "edit-success":
      Content.updateOne({name:"suhe"}, {
        "title": foundContent[4].title
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
          res.redirect("/success")
        }
      });
      break;
      case "edit-fail":
        Content.updateOne({name:"fhe"}, {
          "title": foundContent[5].title,
          "paragraph": foundContent[5].paragraph
        }, function(err) {
          if (err) {
            console.log(err);
            res.redirect("/failed");
          } else {
            res.redirect("/success")
          }
        });
        break;
        default: 
        console.log(err);
        res.redirect("/failed");
          break;
      }
    } else {
      console.log(err + "didn't found any content");
      res.redirect("/failed")
    }
  }
});

// restore default values

app.post("/default", async function(req, res){
  if (lang === "en") {
    let foundContent = await findContent(["mden", "nden", "omden", "sden", "suden", "fden", "auden"]);
    if (foundContent) {
      switch (pageToEdit) {
        case "edit-main":
          Content.updateOne({name: "men"},{
            "title": foundContent[0].title,
             "paragraph": foundContent[0].paragraph,
             "link": foundContent[0].link,
             "link1": foundContent[0].link1,
             "link2": foundContent[0].link2,
             "link3": foundContent[0].link3
     }, function(err) {
       if (err) {
         console.log(err);
         res.redirect("/failed");
       } else {
         res.redirect("/success");
       }
      });
          break;
      case "edit-news":
        Content.updateOne({name: "nen"},{
          "title": foundContent[1].title
   }, function(err) {
     if (err) {
       console.log(err);
       res.redirect("/failed");
     } else {
       res.redirect("/success")
     }
   });
      break;
      case "edit-music":
      Content.updateOne({name: "omen"},{
        "title": foundContent[2].title,
        "link": foundContent[2].link,
        "link1": foundContent[2].link1
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
          res.redirect("/success")
        }
      });
      break;
      case "edit-shows":
      Content.updateOne({name: "sen"}, {
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
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
          res.redirect("/success")
        }
      });
      break;
      case "edit-about":
      Content.updateOne({name: "auen"}, {
        "title": foundContent[6].title,
        "paragraph": foundContent[6].paragraph
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
          res.redirect("/success")
        }
      });
      break;
      case "edit-success":
      Content.updateOne({name:"suen"}, {
        "title": foundContent[4].title
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
          res.redirect("/success")
        }
      });
      break;
      case "edit-fail":
        Content.updateOne({name:"fen"}, {
          "title": foundContent[5].title,
          "paragraph": foundContent[5].paragraph
        }, function(err) {
          if (err) {
            console.log(err);
            res.redirect("/failed");
          } else {
            res.redirect("/success")
          }
        });
        break;
        default: 
        console.log(err);
        res.redirect("/failed");
          break;
      }
    } else {
      console.log(err + "didn't found any content");
      res.redirect("/failed")
    }
  } else {
    let foundContent = await findContent(["mdhe", "ndhe", "omdhe", "sdhe", "sudhe", "fdhe", "audhe"]);
    if (foundContent) {
      switch (pageToEdit) {
        case "edit-main":
          Content.updateOne({name: "mhe"},{
            "title": foundContent[0].title,
             "paragraph": foundContent[0].paragraph,
             "link": foundContent[0].link,
             "link1": foundContent[0].link1,
             "link2": foundContent[0].link2,
             "link3": foundContent[0].link3
     }, function(err) {
       if (err) {
         console.log(err);
         res.redirect("/failed");
       } else {
         res.redirect("/success");
       }
      });
          break;
      case "edit-news":
        Content.updateOne({name: "nhe"},{
          "title": foundContent[1].title
   }, function(err) {
     if (err) {
       console.log(err);
       res.redirect("/failed");
     } else {
       res.redirect("/success")
     }
   });
      break;
      case "edit-music":
      Content.updateOne({name: "omhe"},{
        "title": foundContent[2].title,
        "link": foundContent[2].link,
        "link1": foundContent[2].link1
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
          res.redirect("/success")
        }
      });
      break;
      case "edit-shows":
      Content.updateOne({name: "she"}, {
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
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
          res.redirect("/success")
        }
      });
      break;
      case "edit-about":
      Content.updateOne({name: "auhe"}, {
        "title": foundContent[6].title,
        "paragraph": foundContent[6].paragraph
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
          res.redirect("/success")
        }
      });
      break;
      case "edit-success":
      Content.updateOne({name:"suhe"}, {
        "title": foundContent[4].title
      }, function(err) {
        if (err) {
          console.log(err);
          res.redirect("/failed");
        } else {
          res.redirect("/success")
        }
      });
      break;
      case "edit-fail":
        Content.updateOne({name:"fhe"}, {
          "title": foundContent[5].title,
          "paragraph": foundContent[5].paragraph
        }, function(err) {
          if (err) {
            console.log(err);
            res.redirect("/failed");
          } else {
            res.redirect("/success")
          }
        });
        break;
        default: 
        console.log(err);
        res.redirect("/failed");
          break;
      }
    } else {
      console.log(err + "didn't found any content");
      res.redirect("/failed")
    }
  }
});


// delete images function
app.post("/deleteimage", function(req, res) {
  chosenImageName = req.body.imagechosen;
  imagePath = './public/uploads/images/' + chosenImageName 
  Image.deleteOne({ 
    img: chosenImageName 
  }, function(err){
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully deleted the image from the DB");
    }
  });
  try {
    fs.unlinkSync(imagePath);
    console.log("Successfully deleted the image from the server");
  } catch (error) {
    console.log(error);
  }
  res.redirect("/edit");
});

//choose page to edit
app.post("/edit-pages", function(req, res) {
  pageToEdit = req.body.editPage;
  res.redirect("/edit");
});

// epk page rendering

app.get("/epk", async function (req, res) {
  if (req.isAuthenticated()) {
    activePage = [];
    activePage[3] = "active";
    if (lang === "en") {
      let epkEngCont = await Epk.findOne({name: "epken"});
    if (epkEngCont) {
      res.render("epk", {
        activePage: activePage,
        lang: lang,
        loggedInUser: loggedInUser,
        epkcont: epkEngCont
      });
    } else {
      res.redirect("/failed");
    }
    } else {
      let epkHebCont = await Epk.findOne({name: "epkheb"});
      if (epkHebCont) {
        res.render("epk", {
          activePage: activePage,
          lang: lang,
          loggedInUser: loggedInUser,
          epkcont: epkHebCont
        });
      } else {
        res.redirect("/failed");
      }
    }
  }
});


//logout function

app.post("/logout", function (req, res) {
  req.logout();
  loggedInUser = "";
  res.redirect("/");
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started successfully.");
});