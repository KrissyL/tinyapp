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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// edit a url
app.post("/urls/:shortURL", (req, res) => {
  const newURL = req.body.newURL;
  urlDatabase[newURL] = urlDatabase[req.params.shortURL];
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// post a new shortURL
app.post("/urls", (req, res) => {
  const newLongURL = req.body.longURL; // log the POST req body to console
  const newShortURL = generateRandomString();
  urlDatabase[newShortURL] = newLongURL;
  res.redirect("/urls");
});
// const users = {
//     "userRandomID": {
//         id: "userRandomID",
//         email: "user@example.com",
//         password: "purple-monkey-dinosaur"
//     }
// };
//find user
const findUserByEmail = ((email) => {
  for (const userID in users) {
    // console.log("user.email", user.email)
    if (users[userID].email === email) {
      return users[userID];
    }
  }
});
// post a user registration
app.post("/register", (req, res) =>{
  if (findUserByEmail(req.body.email)) {
    console.log("hi");
    res.status(403);
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
  if (user) {
    if (req.body.password === user.password) {
      res.cookie("user_id", user.id);
      res.redirect("/urls");
    } else {
      res.status(408);
      res.send("Go Away!");
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
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// make a route to handle shortURL reqs
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// make a route for "/urls"
app.get("/urls", (req, res) => {
  const user_id = req.cookies["user_id"];
  const user = users[user_id];
  let templateVars = {
    user,
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

// make a route for "/urls_new"
app.get("/urls/new", (req, res) => {
  const user_id = req.cookies["user_id"];
  const user = users[user_id];
  let templateVars = {
    user,
  };
  res.render("urls_new", templateVars);
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