//server configuration file

var express = require('express');

var handler = require('./requestHandler.js');

var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/../client'));


// app.get('/', handler.index);

app.get('/links', handler.linksGet);
app.post('/links', handler.linksPost);


module.exports = app;