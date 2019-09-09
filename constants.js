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

// generates a random 6 char alphanumeric string
function generateRandomString() {
    const randString = Math.random().toString(15).replace('0.', ' ');
    const randShortURL = randString.substring(1, 7);
    return randShortURL;
};

// validating email input field on registration
const validEmail = (input) => {
  const atPosition = input.indexOf("@");
  const dotPosition = input.lastIndexOf(".");
  if (atPosition < 1 || dotPosition < 2) {
    return false;
  } else {
    return true;
  }
}

// validating a password input field on registration
const validPassword = (input) => {
  const minimumLength = 5;
  if (input.length < minimumLength) {
    return false;
  } else {
    return true;
  }
}

// urls seen by user
const urlsForUser = (id, database) => {
  const forUser = {};
  for (const url in database) {
    const shortURLProps = database[url];
    if (id === shortURLProps.userID) {
      forUser[url] = shortURLProps;
    }
  }
  return forUser;
};

module.exports = { users, urlDatabase, generateRandomString, validEmail, validPassword, urlsForUser };

