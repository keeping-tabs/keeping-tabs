var auth = angular.module('keepingTabs.auth', []);


auth.config(function($stateProvider) {
  
  $stateProvider.state('signup', {
    url: '/signup',
    controller: 'signupCtrl',
    templateUrl: './auth/signup.html'
  });

  // $stateProvider.state('login', {
    
  // });
  console.log('auth');
});

auth.factory('Auth', function($http) {
  return {
    login: login,
    signup: signup
  };

  function signup(user) {
    console.log('signup', user);
    $http.post('/api/signup', {username: user});
  }

  function login(user) {
    console.log('login', user);
  }
});

auth.controller('signupCtrl', require('./signupCtrl.js'));

module.exports = auth;