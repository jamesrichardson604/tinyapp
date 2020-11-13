const { emailCheck, generateRandomString, urlsForUser } = require('./helper.js');
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');


app.set("view engine", "ejs");

//DATABASES
const urlDatabase = {
};

const users = {
};

//MIDDLEWARE
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['test'],
}));

//GET ROUTES
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/urls", (req, res) => {
  const currentUserID = req.session.user_id;
  const currentUserURLS = urlsForUser(currentUserID, urlDatabase);
  const templateVars = {
    urls: currentUserURLS,
    user: users[req.session.user_id],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  const currentUserID = req.session.user_id;
  if (!currentUserID) {
    res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session.user_id],
    urlUserID: urlDatabase[req.params.shortURL].userID
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = `https://${urlDatabase[req.params.shortURL].longURL}`;
  res.redirect(longURL);
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("login", templateVars);
});

//POST ROUTES
//generate unique shortURL
app.post("/urls", (req, res) => {
  const currentUserID = req.session.user_id;
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL: longURL, userID: currentUserID};
  res.redirect(`/urls/${shortURL}`);
});

//delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.user_id;
  const urlUserID = urlDatabase[req.params.shortURL].userID;
  if (userID === urlUserID) {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect("/urls");
});

app.post('/logout/:userEmail', (req,res) => {
  req.session = null;
  res.redirect('/urls');
});

//user register
app.post('/register', (req, res) => {
  const userRandomID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (emailCheck(email, users)) {
    return res.status(400).send({error: "Email already in use!", status: 400});
  }
  if (email === '' || password === '') {
    return res.status(400).send({error: "Email already in use!", status: 400});
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  users[userRandomID]  = {
    id: userRandomID,
    email,
    password: hashedPassword
  };
  const id = users[userRandomID].id;
  req.session.user_id = id;
  res.redirect('/urls');
});

//user login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const passwordCheck = emailCheck(email,users).password;
  if (!emailCheck(email, users)) {
    return res.status(403).send({error: "Incorrect Email/Password", status: 403});
  }
  if (emailCheck(email, users)) {
    if (!bcrypt.compareSync(password, passwordCheck)) {
      return res.status(403).send({error: "Incorrect Email/Password", status: 403});
    }
    req.session.user_id = (emailCheck(email, users)).id;
  }
  res.redirect("/urls");
});

//PUT ROUTES
//edit a URL resource
app.put("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const urlUserID = urlDatabase[req.params.id].userID;
  if (userID === urlUserID) {
    urlDatabase[req.params.id].longURL = req.body.updateURL;
  }
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

