var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.get('/', function(req, res){
  res.send(200, 'OK'); 
});

app.listen(app.get('port'), function() {
  console.log('App is running on port ', app.get('port'));
});
