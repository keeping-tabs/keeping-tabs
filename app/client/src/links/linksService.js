module.exports = function($http) {


  var local = JSON.parse(localStorage.keepingTabs);
	var username = local.username;
  var token = local.token;

  console.log('the username: ', username);
  console.log('the token: ', token);


	return $http({
	  url: '/api/links', 
	  method: 'GET',
	  params: {username: username},
    headers: {
      Authorization: 'Bearer ' + token
    }
	})
  .then(function(result){
    return result.data;
  });


  // return $http.get('/api/links?username=' + username).then(function(result){
  //   return result.data;
  // });
};