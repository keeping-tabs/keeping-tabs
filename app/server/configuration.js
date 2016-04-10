var express = require('express');
var handler = require('./requestHandler.js');
var auth = require('./authHandler.js');
var bodyParser = require('body-parser');

var app = express();

module.exports = app;

/////*****/////*****/////*****/////*****/////*****
// middleware
/////*****/////*****/////*****/////*****/////*****

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'chrome-extension://amaekhdmilmhgmoaackfphcjclhghmfe');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

app.use('/api', allowCrossDomain);

// use the body parser to recognize json and url data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// use express static to set the statically hosted files to the serve from the client directory
app.use('/', express.static(__dirname + '/../client/dist/'));

// handle chrome extension script
app.use('/chrome', allowCrossDomain, express.static(__dirname+ '/../chrome'));

// set the view rendering to generate from the views directory
app.set('views', __dirname + '/views');
// set the view engine to use jade
app.set('view engine', 'jade');

/////*****/////*****/////*****/////*****/////*****
// middleware
/////*****/////*****/////*****/////*****/////*****


/////*****/////*****/////*****/////*****
// set request paths below
/////*****/////*****/////*****/////*****

// app.get('/', handler.index);

app.get('/api/links', auth.authenticate, handler.linksGet);
app.post('/api/links', auth.authenticate, handler.linksPost);

//jade rendering
// app.get('/urls', handler.urls);

// set chrome ext env
app.get('/api/env', function(req, res) {
  var envUrl = req.protocol + '://' + req.get('host');
  res.send('var ENV = {url: \'' + envUrl + '\'};');
});

app.post('/api/signup', auth.signup);
app.post('/api/login', auth.login);

/////*****/////*****/////*****/////*****
// set request paths above
/////*****/////*****/////*****/////*****

