var db = require('./database.js');

var Auth = function() {
  return {
    login: handleLogin,
    signup: handleSignup,
    authenticate: auth
  };

  function handleLogin(req, res) {
    var username = req.body.username;
    var password =  req.body.password;

    db.fetchUserId(username).then(function(users) {
      // do check password
      res.send(200);
    }).catch(function(reason) {
      res.send(500);
      console.log('Login failed: ', reason);
    });
  }

  function handleSignup(req, res) {
    var username = req.body.username;
    var password =  req.body.password;

    // query db for the username
    db.fetchUserId(username).then(function(users) {
      
      if(users.length > 0) { // check if user exist
        console.warn('User '+ username + 'already exist');
        
        res.send(422);

      } else {
        db.saveUsers([username]).then(function() {
          console.log('User '+ username + 'created');
          
          res.send(201, {token: 'faketoken'});

        });
      }
    }).catch(function(reason) {
      res.send(500);
      console.error('Signup failed: ', reason);
    });
  }

  // middleware
  function auth(req, res, next) {

  }
};

module.exports = Auth();