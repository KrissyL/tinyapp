const { assert } = require('chai');
const { findUserByEmail } = require('../helpers.js');

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

describe('findUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = findUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(expectedOutput, user.id);
  })

  it('should return undefined if the email does not belong to a user in the database', () => {
    const user = findUserByEmail("sally@example.com", testUsers)
    const expectedOutput = undefined;
    assert.equal(expectedOutput, user);
  });
});