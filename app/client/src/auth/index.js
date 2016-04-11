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

auth.factory('Auth', function($http, chromeID, jwtHelper) {
  return {
    login: login,
    signup: signup
  };

  function signup(user) {
    /* globals chrome:false */
    console.log('signup', user);
    return $http.post('/api/signup', {username: user.username, password: user.password})
    .then(function(result){
      console.log('token: ', result.data.token);
      var token = result.data.token;
      var user = jwtHelper.decodeToken(token);

      console.log('token user: ', user);
      setLocalStorage(user, token);
    });
  }

  function login(user) {
    console.log('login', user);
    return $http.post('/api/login', {username: user.username, password: user.password})
    .then(function(result){
      var token = result.data.token;
      var user = jwtHelper.decodeToken(token);

      console.log('token: ', result.data.token);
      var token = result.data.token;

      setLocalStorage(user, token);
    
    });
  }

  function setLocalStorage(user, token) {
    var local = JSON.parse(localStorage.keepingTabs);

    local.username = user.username; // should change to storing JWT
    local.token = token;
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