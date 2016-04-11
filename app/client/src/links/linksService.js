module.exports = function($http) {



	var username = JSON.parse(localStorage.keepingTabs).username;
  console.log('the username: ', username);


	return $http({
	  url: '/api/links', 
	  method: 'GET',
	  params: {username: username}
	})
  .then(function(result){
    return result.data;
  });


  // return $http.get('/api/links?username=' + username).then(function(result){
  //   return result.data;
  // });
};