var auth = angular.module('keepingTabs.auth', []);

if(window.location.hostname === 'localhost') {
  // auth.constant('chromeID', 'oemdjnakicolhbihmkgeglmbchojlepk');
  auth.constant('chromeID', 'mnpdddadmepheffcplflcgknojcpjpem');
} else {
  auth.constant('chromeID', 'amaekhdmilmhgmoaackfphcjclhghmfe');
}

auth.config(function($stateProvider, $httpProvider, jwtInterceptorProvider) {

  var path = './auth/';
  
  $stateProvider.state('signup', {
    url: '/signup',
    controller: 'signupCtrl',
    templateUrl: path + 'signup.html',
    authenticate: false
  });

  $stateProvider.state('login', {
    url: '/login',
    controller: 'loginCtrl',
    templateUrl: path + 'login.html',
    authenticate: false
  });

  localStorage.keepingTabs = localStorage.keepingTabs ? localStorage.keepingTabs : '{}';

  jwtInterceptorProvider.tokenGetter = function() {
    var token = localStorage.getItem('keepingTabs') && JSON.parse(localStorage.getItem('keepingTabs')).token;
    console.log('interceptor token: ', token);
    return token;
  };

  $httpProvider.interceptors.push('jwtInterceptor');

});

auth.factory('Auth', function($http, chromeID, jwtHelper) {

  return {
    login: login,
    signup: signup,
    logout: logout,
    isAuthed: isAuthed
  };

  function signup(user) {
    /* globals chrome:false */
    console.log('signup', user);
    return $http.post('/api/signup', {username: user.username, password: user.password})
    .then(function(result){
      var token = result.data.token;
      var user = jwtHelper.decodeToken(token);
      

      console.log('token: ', token);
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

      console.log('token: ', token);
      console.log('token user: ', user);

      setLocalStorage(user, token);
    
    });
  }

  function logout() {
    if(localStorage.keepingTabs) {
      console.log('fake logout');
      window.localStorage.removeItem('keepingTabs');
    }
  }

  function isAuthed() {
    // jwtHelper.isTokenExpired();
    return !!localStorage.getItem('keepingTabs') && localStorage.getItem('keepingTabs') !== '{}';
  }

  function setLocalStorage(user, token) {
    console.log('setLocalStorage...');
    var local = JSON.parse(localStorage.keepingTabs);

    local.username = user.username; // should change to storing JWT
    local.token = token;
    localStorage.keepingTabs = JSON.stringify(local);
    
    console.log('sending token to chrome: ', chromeID);
    chrome.runtime.sendMessage(chromeID, {username: user.username, token: token},
    function(response) {
      console.log('response from chrome ext: ', response);
    });
  }
});

auth.directive('googleSignIn', require('./googleSignInDirective.js'));

auth.controller('signupCtrl', require('./signupCtrl.js'));
auth.controller('loginCtrl', require('./loginCtrl.js'));

module.exports = auth;