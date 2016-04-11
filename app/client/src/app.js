var angular = require('angular');
require('angular-ui-router');
require('angular-jwt');

require('./auth');
require('./links');

var app = angular.module('keepingTabs', [
  'angular-jwt',
  'ui.router',
  'keepingTabs.auth',
  'keepingTabs.links'
]);

app.config(function($urlRouterProvider, $stateProvider) {
  
  $urlRouterProvider.otherwise('/urls');
  console.log('main');

});


app.run(function ($rootScope, $state, Auth) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    if (toState.authenticate && !Auth.isAuthed()){
      // User isn’t authenticated
      console.log('bad bad boy');
      $state.transitionTo('login');
      event.preventDefault();
    }
  });
});

angular.bootstrap(document, ['keepingTabs']);