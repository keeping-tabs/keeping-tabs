var db = require('./database.js');

var Auth = function() {
  return {
    login: handleLogin,
    signup: handleSignup
  };

  function handleLogin(req, res) {
    
  }

  function handleSignup(req, res) {
    // req.body.username
    // req.body.password

    // query db for the username
      // if found, redirect to login
    // add user to the table
  }

  // middleware
  function auth(req, res, next) {

  }
};

module.exports = Auth();