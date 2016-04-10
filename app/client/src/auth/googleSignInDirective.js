module.exports = function() {
  return {
    scope: {},
    link: function(scope, element, attrs) {
      // gapi.load('auth2', function() {
      //   gapi.auth2.init();
      // });


      // attrs.onsuccess = function(googleUser) {
      //   var profile = googleUser.getBasicProfile();
      //   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      //   console.log('Name: ' + profile.getName());
      //   console.log('Image URL: ' + profile.getImageUrl());
      //   console.log('Email: ' + profile.getEmail());
      // };
    }
  };
};