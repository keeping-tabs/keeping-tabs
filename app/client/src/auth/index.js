var auth = angular.module('keepingTabs.auth', []);


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

});

auth.factory('Auth', function($http) {
  return {
    login: login,
    signup: signup
  };

  function signup(user) {
    console.log('signup', user);
    $http.post('/api/signup', {username: user})
    .then(function(result){
      console.log('token: ', result.data.token);
    }).catch(function(reason) {
      console.error('Login failed: ', reason.data);
    });
  }

  function login(user) {
    console.log('login', user);
    $http.post('/api/login', {username: user})
    .then(function(result){
      console.log('token: ', result.data.token);
    }).catch(function(reason) {
      console.error('Login failed: ', reason.data);
    });
  }
});

auth.directive('googleSignIn', require('./googleSignInDirective.js'));

auth.controller('signupCtrl', require('./signupCtrl.js'));
auth.controller('loginCtrl', require('./loginCtrl.js'));

module.exports = auth;