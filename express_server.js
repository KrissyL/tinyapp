const express = require("express");
const app = express();
const PORT = 8080; // default port
const bodyParser = require("body-parser");

// generates a random 6 char alphanumeric string
function generateRandomString() {
    const randString = Math.random().toString(15).replace('0.', ' ');
    const randShortURL = randString.substring(1, 7);
    return randShortURL;
}
// uses body-parser to make POST req human readable
app.use(bodyParser.urlencoded({extended: true}));

// set ejs as view engine
app.set("view engine", "ejs");

// create URL database
const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
  };

// make a route for "/urls"
app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
  });

  // edit a url
app.post("/urls/:shortURL", (req, res) => {
    const newURL = req.body.newURL;
    console.log(newURL);
    urlDatabase[newURL]= urlDatabase[req.params.shortURL];
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
});

// post a new shortURL
app.post("/urls", (req, res) => {
    const newLongURL = req.body.longURL; // log the POST req body to console
    const newShortURL = generateRandomString();
    console.log(newShortURL);
    urlDatabase[newShortURL] = newLongURL;
    console.log(newLongURL);
    res.redirect("/urls");
});


// delete a url
app.post("/urls/:shortURL/delete", (req, res) => {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
});

// make a route to handle shortURL reqs
app.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
});

// make a route for "/urls_new"
app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});

// make a route for "urls_show"
app.get("/urls/:shortURL", (req, res) => {
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]
    };
    res.render("urls_show", templateVars);
});

//listen to port 8080
app.listen(8080);
console.log(`app listening on port ${PORT}`);