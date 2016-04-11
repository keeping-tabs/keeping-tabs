module.exports = function($scope, Auth, $state) {
  $scope.user = {};
  $scope.login = function(user) {
    Auth.login($scope.user).then(function() {
      $state.go('links');
    });
  };
};