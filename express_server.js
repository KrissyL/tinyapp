const express = require("express");
const app = express();
const PORT = 8080; // default port

// set ejs as view engine
app.set("view engine", "ejs");

// make a route for "/urls"
app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
});