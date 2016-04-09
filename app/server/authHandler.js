var db = require('./database.js');

var Auth = function() {
  return {
    login: handleLogin,
    signup: handleSignup,
    authenticate: auth
  };

  function handleLogin(req, res) {
    var username = req.body.username;
    // var password =  req.body.password;

    db.fetchUserId(username).then(function(users) {
      // do check password
      if(users.length > 0) {
        res.status(200).send({token: 'faketoken'});
      } else {
        console.warn('User '+ username + ' doesn\'t exist');
        res.status(401).send('User '+ username + ' doesn\'t exist');
      }
    }).catch(function(reason) {
      res.sendStatus(500);
      console.log('Login failed: ', reason);
    });
  }

  function handleSignup(req, res) {
    var username = req.body.username;
    // var password =  req.body.password;

    // query db for the username
    db.fetchUserId(username).then(function(users) {
      
      if(users.length > 0) { // check if user exist
        console.warn('User '+ username + ' already exist');
        
        res.sendStatus(422);

      } else {
        db.saveUsers([username]).then(function() {
          console.log('User '+ username + ' created');
          
          res.status(201).send({token: 'faketoken'});

        });
      }
    }).catch(function(reason) {
      res.sendStatus(500);
      console.error('Signup failed: ', reason);
    });
  }

  // middleware
  function auth(req, res, next) {

  }
};

module.exports = Auth(); /* jshint ignore:line */