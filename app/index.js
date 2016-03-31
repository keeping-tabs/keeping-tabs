//this is the intro server file

// require('./src/server/app.js');

// configure the server. return an express app as the module export
var app = require('./server/configuration.js');

var port = process.env.PORT || 8080;

app.listen(port);

console.log('Server now listening on port ' + port);