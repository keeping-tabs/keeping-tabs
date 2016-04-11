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

angular.bootstrap(document, ['keepingTabs']);