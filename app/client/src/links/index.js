var links = angular.module('keepingTabs.links', []);

links.config(function($stateProvider) {

  var path = './links/';
  
  $stateProvider.state('links', {
    url: '/urls',
    controller: 'linksCtrl',
    templateUrl: path + 'links.html'
  });

});

links.controller('linksCtrl', require('./linksCtrl.js'));

module.exports = links;