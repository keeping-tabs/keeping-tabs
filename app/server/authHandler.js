var db = require('./database.js');
var jwt = require('jsonwebtoken');

var Auth = function() {
  return {
    login: handleLogin,
    signup: handleSignup,
    authenticate: auth
  };

  function handleLogin(req, res) {
    var username = req.body.username;
    var password =  req.body.password;

    db.fetchUser(username).then(function(users) {
      // do check password
      if(users.length === 1) {
        console.log('users: ', users);

        var user = users[0];
        if (user.salt + password === user.password) {
          var token = jwt.sign({username: username}, 'keepingTabsIsTheBoss');
          res.status(200).send({token: token});
        } else {
          console.warn('User '+ username + ' and password doesn\'t exist');
          res.status(401).send('User '+ username + ' doesn\'t exist');  
        }
      } else {
        console.warn('User '+ username + ' and password doesn\'t exist');
        res.status(401).send('User '+ username + ' doesn\'t exist');
      }
    }).catch(function(reason) {
      res.sendStatus(500);
      console.log('Login failed: ', reason);
    });
  }

  function handleSignup(req, res) {
    var username = req.body.username;
    var password =  req.body.password;

    // query db for the username
    db.fetchUserId(username).then(function(users) {
      
      if(users.length > 0) { // check if user exist
        console.warn('User '+ username + ' already exist');
        
        res.sendStatus(422);

      } else {
        db.saveUsers([{username: username, password: password}]).then(function() {
          console.log('User '+ username + ' created');

          var token = jwt.sign({username: username}, 'keepingTabsIsTheBoss');

          console.log('attempt to set token')
          
          res.status(201).send({token: token});

        });
      }
    }).catch(function(reason) {
      res.sendStatus(500);
      console.error('Signup failed: ', reason);
    });
  }

  // middleware
  function auth(req, res, next) {
    next();
  }
};

module.exports = Auth(); /* jshint ignore:line */