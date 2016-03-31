//server configuration file

var express = require('express');

var handler = require('./requestHandler.js');

var bodyParser = require('body-parser');

var app = express();

module.exports = app;

/////*****/////*****/////*****/////*****/////*****
// middleware
/////*****/////*****/////*****/////*****/////*****

// use the body parser to recognize json and url data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// use express static to set the statically hosted files to the serve from the client directory
app.use(express.static(__dirname + '/../client'));

// set the view rendering to generate from the views directory
app.set('views', __dirname + '/views')
// set the view engine to use jade
app.set('view engine', 'jade');

/////*****/////*****/////*****/////*****/////*****
// middleware
/////*****/////*****/////*****/////*****/////*****


/////*****/////*****/////*****/////*****
// set request paths below
/////*****/////*****/////*****/////*****

// app.get('/', handler.index);

app.get('/links', handler.linksGet);
app.post('/links', handler.linksPost);

//jade rendering
app.get('/urls', function (req, res) {
  res.render('links', { title: 'Hey', message: 'Hello there!', script: 'alert(\'Got Ya\');'});
});

/////*****/////*****/////*****/////*****
// set request paths above
/////*****/////*****/////*****/////*****

