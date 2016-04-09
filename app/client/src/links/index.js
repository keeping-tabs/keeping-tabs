var links = angular.module('keepingTabs.links', []);

links.config(function($stateProvider) {

  var path = './links/';
  
  $stateProvider.state('links', {
    resolve: {
      links: function(linksService) {
        return linksService;
      }
    },
    url: '/urls',
    controller: 'linksCtrl',
    templateUrl: path + 'links.html'
  });

});

links.factory('linksService', require('./linksService.js'));

links.controller('linksCtrl', require('./linksCtrl.js'));

module.exports = links;