const generateRandomString = function() {
  const alphaNum = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const alphaNumArray = alphaNum.split('');
  let randomAlphaNumArray = [];
  for (let i of alphaNumArray) {
    let randomIndex = Math.floor(Math.random() * Math.floor(alphaNumArray.length));
    let randomAlphaNum = alphaNumArray[randomIndex];
    if (randomAlphaNumArray.length < 6) {
      randomAlphaNumArray.push(randomAlphaNum);
    }
  }
  // ensure there is always at least one number in the random alphanumeric string
  for (let i of randomAlphaNumArray) {
    if (Number(i)) {
      return randomAlphaNumArray.join('');
    } else {
      return generateRandomString();
    }
  }
};
const emailCheck = function(email, users) {
  const userArray = Object.values(users);
  if (userArray.length !== 0) {
    for (let user of userArray) {
      if (Object.values(user).includes(email)) {
        return user;
      }
    }
  }
  return false;
};

const urlsForUser = function(id, urlDatabase) {
  let urlUserMatch = {};
  const urlArray = Object.entries(urlDatabase);
  for (let url of urlArray) {
    if (url[1].userID === id) {
      urlUserMatch[url[0]] = url[1];
    }
  }
  return urlUserMatch;
};

module.exports = { generateRandomString, emailCheck, urlsForUser };