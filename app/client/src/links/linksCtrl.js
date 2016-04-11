module.exports = function($scope, links, Auth, $state) {
  $scope.links = links;
  $scope.logout = function() {
    Auth.logout();
    $state.go('login');
  };
};