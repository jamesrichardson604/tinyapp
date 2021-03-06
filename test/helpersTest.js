const { assert } = require('chai');

const { emailCheck } = require('../helper.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('emailCheck', function() {
  it('should return a user with valid email', function() {
    const user = emailCheck("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.equal(user.id, expectedOutput);
  });
  it('should return undefined if user email does not exist', function() {
    const user = emailCheck('', testUsers);
    const expectedOutput = undefined;
    assert.equal(user.id, expectedOutput);
  });
});