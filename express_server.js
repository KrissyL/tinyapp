const express = require("express");
const app = express();
const PORT = 8080; // default port
const bodyParser = require("body-parser");

// generates a random 6 char alphanumeric string
function generateRandomString() {

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

// route to handle POST request
app.post("/urls", (req, res) => {
    console.log(req.body); // log the POST req body to console
    res.send("Ok");        // respond with "Ok" (tb replaced)
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