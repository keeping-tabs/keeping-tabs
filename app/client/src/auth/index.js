var auth = angular.module('keepingTabs.auth', []);

if(window.location.hostname === 'localhost') {
  auth.constant('chromeID', 'oemdjnakicolhbihmkgeglmbchojlepk');
} else {
  auth.constant('chromeID', 'amaekhdmilmhgmoaackfphcjclhghmfe');
}

auth.config(function($stateProvider) {

  var path = './auth/';
  
  $stateProvider.state('signup', {
    url: '/signup',
    controller: 'signupCtrl',
    templateUrl: path + 'signup.html'
  });

  $stateProvider.state('login', {
    url: '/login',
    controller: 'loginCtrl',
    templateUrl: path + 'login.html'
  });

  localStorage.keepingTabs = localStorage.keepingTabs ? localStorage.keepingTabs : '{}';

});

auth.factory('Auth', function($http, chromeID) {
  return {
    login: login,
    signup: signup
  };

  function signup(user) {
    /* globals chrome:false */
    console.log('signup', user);
    return $http.post('/api/signup', {username: user, password: user.password})
    .then(function(result){
      console.log('token: ', result.data.token);

      setlocalStorage(user);

    }).catch(function(reason) {
      console.error('Login failed: ', reason.data);
    });
  }

  function login(user) {
    console.log('login', user);
    return $http.post('/api/login', {username: user.username, password: user.password})
    .then(function(result){
      console.log('token: ', result.data.token);

      setlocalStorage(user);
    
    }).catch(function(reason) {
      console.error('Login failed: ', reason.data);
    });
  }

  function setlocalStorage(user) {
    var local = JSON.parse(localStorage.keepingTabs);

    local.username = user.username; // should change to storing JWT
    localStorage.keepingTabs = JSON.stringify(local);

    chrome.runtime.sendMessage(chromeID, {username: user.username},
    function(response) {
      console.log('response from chrome ext: ', response);
    });
  }
});

auth.directive('googleSignIn', require('./googleSignInDirective.js'));

auth.controller('signupCtrl', require('./signupCtrl.js'));
auth.controller('loginCtrl', require('./loginCtrl.js'));

module.exports = auth;