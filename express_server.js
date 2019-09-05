const express = require("express");
const app = express();
const PORT = 8080; // default port
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// generates a random 6 char alphanumeric string
function generateRandomString() {
  const randString = Math.random().toString(15).replace('0.', ' ');
  const randShortURL = randString.substring(1, 7);
  return randShortURL;
}
// uses body-parser to make POST req human readable
app.use(bodyParser.urlencoded({extended: true}));

//uses cookie parser to make cookies readable
app.use(cookieParser());

// set ejs as view engine
app.set("view engine", "ejs");

// create a users database
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  }
};

// create URL database
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "someUserID"},
  "9sm5xK": { longURL: "http://www.google.com", userID: "someUserID"}
};

// urls seen by user
const urlsForUser = (id) => {
  const forUser = {};
  for (const url in urlDatabase) {
    const shortURLProps = urlDatabase[url];
    if (id === shortURLProps.userID) {
      forUser[url] = shortURLProps;
    }
  }
  return forUser;
};

//find user
const findUserByEmail = ((email) => {
  for (const userID in users) {
    if (users[userID].email === email) {
      return users[userID];
    }
  }
});

// edit a url
app.post("/urls/:shortURL", (req, res) => {
  const user_id = req.cookies["user_id"];
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
  const newLongURL = req.body.longURL; // log the POST req body to console
  const newShortURL = generateRandomString();
  const user = users[req.cookies["user_id"]];
  urlDatabase[newShortURL] =
  {
    longURL: newLongURL,
    userID: user["id"]
  };
  res.redirect("/urls");
});

// post a user registration
app.post("/register", (req, res) =>{
  if (findUserByEmail(req.body.email)) {
    res.send("User already exists");
  } else {
    const newUser = {
      id: generateRandomString(),
      email: req.body.email,
      password: req.body.password
    };
    users[newUser.id] = newUser;
    res.cookie("user_id", newUser.id);
    res.redirect("/urls");
  }
});

// post a login
app.post("/login", (req, res) => {
  const user = findUserByEmail(req.body.email);
  if (!user) {
    res.send("Incorrect Login");
  } else {
    if (req.body.password === user.password) {
      res.cookie("user_id", user.id);
      res.redirect("/urls");
    }
  }
});

// post a logout
app.post("/logout", (req, res) =>{
  res.clearCookie("user_id");
  res.redirect("/urls");
});


// delete a url
app.post("/urls/:shortURL/delete", (req, res) => {
  const user_id = req.cookies["user_id"];
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
  const user_id = req.cookies["user_id"];
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
      urls: urlsForUser(user.id),
    };
    res.render("urls_index", templateVars);
  }
});

// make a route for "/urls_new"
app.get("/urls/new", (req, res) => {
  const user_id = req.cookies["user_id"];
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
      urls: urlsForUser(user.id)
    };
    res.render("urls_new", templateVars);
  }
});

// make a route for "urls_show"
app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.cookies["user_id"];
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
  const user_id = req.cookies["user_id"];
  const user = users[user_id];
  let templateVars = {
    user
  };
  res.render("registration", templateVars);
});

// make a route for "/login"
app.get("/login", (req, res) => {
  const user_id = req.cookies["user_id"];
  const user = users[user_id];
  let templateVars = {
    user
  };
  res.render("login", templateVars);
});

//listen to port 8080
app.listen(8080);
console.log(`app listening on port ${PORT}`);