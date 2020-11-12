const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override');
const cookieSession = require('cookie-session')


app.set("view engine", "ejs");

const urlDatabase = {
};

const users = {
};


//Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser())
app.use(cookieSession({
  name: 'session',
  keys: ['test'],
}))


function generateRandomString() {
  const alphaNum = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const alphaNumArray = alphaNum.split('')
  let randomAlphaNumArray = []
  for (let i of alphaNumArray) {
    let randomIndex = Math.floor(Math.random() * Math.floor(alphaNumArray.length))
    let randomAlphaNum = alphaNumArray[randomIndex]
    if (randomAlphaNumArray.length < 6){
     randomAlphaNumArray.push(randomAlphaNum)
    }
  }
  // ensure there is always at least one number in the random alphanumeric string 
  for (let i of randomAlphaNumArray){
    if (Number(i)) {
      return randomAlphaNumArray.join('')
    } else {
      return generateRandomString()
    }
  }
}
const emailCheck = function(email, users){
  const userArray = Object.values(users)
  if (userArray.length !== 0) {
    for(let user of userArray) {
      if (Object.values(user).includes(email)) {
        return true
      } 
    }
  }
  return false
}

//GET ROUTES
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    user: users[req.session.user_id]
   };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
  user: users[req.session.user_id]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.session.user_id]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = `https://${urlDatabase[req.params.shortURL]}`
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  }
  res.render("register", templateVars)
})

//POST ROUTE
//generate unique shortURL
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL
  res.redirect(`/urls/${shortURL}`)
});

//delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls")
});

//update a URL resource
app.put("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.updateURL
  res.redirect("/urls")
});

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username)
  res.redirect("/urls")
});

app.post('/logout/:userEmail', (req,res) => {
  req.session = null;
  res.redirect('/urls');
});

//user register
app.post('/register', (req, res) => {
  const userRandomID = generateRandomString()
  const email = req.body.email
  const password = req.body.password
  if (emailCheck(email, users)) {
    return res.status(400).send({error: "Email already in use!", status: 400})
  } 
  if (email === '' || password === ''){
    return res.status(400).send({error: "Email already in use!", status: 400})
  }
  users[userRandomID]  = {
    id: userRandomID,
    email,
    password
  }
  const id = users[userRandomID].id
  req.session.user_id = id
  res.redirect('/urls');
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

