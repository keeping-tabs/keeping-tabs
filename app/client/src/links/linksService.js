module.exports = function($http) {


 //  var local = JSON.parse(localStorage.keepingTabs);
	// var username = local.username;
 //  var token = local.token;

 //  console.log('the username: ', username);
 //  console.log('the token: ', token);

  return $http.get('/api/links').then(function(result){
    return result.data;
  });
};