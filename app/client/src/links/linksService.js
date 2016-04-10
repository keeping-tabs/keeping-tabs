module.exports = function($http) {
  return $http.get('/api/links').then(function(result){
    return result.data;
  });
};