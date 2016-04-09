var angular = require('angular');
require('angular-ui-router');

var app = angular.module('keepingTabs', ['ui.router', 'keepingTabs.auth']);

app.config(function($urlRouterProvider, $stateProvider) {
  
  $urlRouterProvider.otherwise('/');
  console.log('main');

});

require('./auth');


angular.bootstrap(document, ['keepingTabs']);