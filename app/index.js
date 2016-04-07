//this is the intro server file

// require('./src/server/app.js');

// configure the server. return an express app as the module export
var app = require('./server/configuration.js');
var db = require('./server/database');

var port = process.env.PORT || 8080;

if(module.parent) {
  module.exports = app; // so we can require in tests
} else{
  app.listen(port);
  console.log('Server now listening on port ' + port);
}


