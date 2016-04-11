module.exports = function($scope, Auth, $state) {
  $scope.user = {};
  $scope.signup = function() {
    Auth.signup($scope.user).then(function() {
      $state.go('link');
    });
  };
};