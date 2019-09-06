const express = require("express");
const app = express();
const PORT = 8080; // default port
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cookieSession = require("cookie-session");
const { users, urlDatabase, generateRandomString, urlsForUser } = require("./constants");
const { findUserByEmail } = require("./helpers");
// uses body-parser to make POST req human readable
app.use(bodyParser.urlencoded({extended: true}));

//use to secure cookies
app.use(cookieSession({
  name: 'session',
  keys: ["test","key"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// set ejs as view engine
app.set("view engine", "ejs");

// edit a url
app.post("/urls/:shortURL", (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  if (!user) {
    res.send("Nope, can't do that");
  } else {
    const newURL = req.body.newURL;
    urlDatabase[newURL] = urlDatabase[req.params.shortURL];
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
});

// post a new shortURL
app.post("/urls", (req, res) => {
  const newLongURL = req.body.longURL;
  const newShortURL = generateRandomString();
  const user = req.session.user_id;
  urlDatabase[newShortURL] =
  {
    longURL: newLongURL,
    userID: user
  };
  res.redirect("/urls");
});

// post a user registration
app.post("/register", (req, res) =>{
  if (findUserByEmail(req.body.email, users)) {
    res.send("User already exists");
  } else {
    const newUser = {
      id: generateRandomString(),
      email: req.body.email,
      hashedPassword: bcrypt.hashSync(req.body.password, 10)
    };
    users[newUser.id] = newUser;
    req.session.user_id = newUser.id;
    res.redirect("/urls");
  }
});

// post a login
app.post("/login", (req, res) => {
  const user = findUserByEmail(req.body.email, users);
  if (!user) {
    res.redirect("/login/redir");
  } else {
    
    if (bcrypt.compareSync(req.body.password, user.hashedPassword)) {
      req.session.user_id = user.id;
      res.redirect("/urls");
    }
  }
});

// post a logout
app.post("/logout", (req, res) =>{
  req.session = null;
  res.redirect("/urls");
});


// delete a url
app.post("/urls/:shortURL/delete", (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  if (!user) {
    res.send("Nope, you can't do that");
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
});

// make a route for "/urls"
app.get("/urls", (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  if (!user) {
    let templateVars = {
      user,
      urls: urlDatabase,
    };
    res.render("urls_index", templateVars);
  } else {
    let templateVars = {
      user,
      urls: urlsForUser(user.id, urlDatabase),
    };
    res.render("urls_index", templateVars);
  }
});

// make a route for "/urls_new"
app.get("/urls/new", (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  if (!user) {
    let templateVars = {
      user,
      urls: urlDatabase
    };
    res.render("urls_new", templateVars);
  } else {
    let templateVars = {
      user,
      urls: urlsForUser(user.id, urlDatabase)
    };
    res.render("urls_new", templateVars);
  }
});

// make a route for "urls_show"
app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  let templateVars = {
    user,
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

// make a route to handle shortURL reqs
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// make a route for "/register"
app.get("/register", (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  let templateVars = {
    user
  };
  res.render("registration", templateVars);
});

// make a route for "/login"
app.get("/login", (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  let templateVars = {
    user
  };
  res.render("login", templateVars);
});

// make a route for "/login"
app.get("/login/redir", (req, res) => {
  const user_id = req.session.user_id;
  const user = users[user_id];
  let templateVars = {
    user
  };
  res.render("invalidLogin", templateVars);
});

//listen to port 8080
app.listen(8080);
console.log(`app listening on port ${PORT}`);