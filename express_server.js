const express = require("express");
const app = express();
const PORT = 8080; // default port

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

// make a route for "urls_show"
app.get("/urls/:shortURL", (req, res) => {
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]
    };
    res.render("urls_show", templateVars);
});

//listen to port 8080
app.listen(8080);
console.log(`app listening on port ${PORT}`);