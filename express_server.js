const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

function generateRandomString() {
  const alphaNum = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const alphaNumArray = alphaNum.split('')
  let randomAlphaNumArray = []
  for (let i of alphaNumArray) {
    let randomIndex = Math.floor(Math.random() * Math.floor(alphaNumArray.length))
    let randomAlphaNum = alphaNumArray[randomIndex]
    if (randomAlphaNumArray.length <= 6){
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

//GET ROUTES
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL : urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = `https://${urlDatabase[req.params.shortURL]}`
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//POST ROUTE
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL
  res.redirect(`/urls/${shortURL}`)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});