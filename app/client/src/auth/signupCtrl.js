module.exports = function($scope, Auth, $state) {
  $scope.user = {};
  $scope.signup = function() {
    Auth.signup($scope.user).then(function() {
      $state.go('links');
    }, function(error) {
      console.log('show error msg: ', error);
    });
  };
};