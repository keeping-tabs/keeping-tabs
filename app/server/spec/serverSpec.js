var expect = require('chai').expect;
var server = require('../../index.js');
var supertest = require('supertest');

var request = supertest.agent(server);
 
/*global beforeEach, afterEach, describe, expect, it, spyOn, xdescribe, xit */

describe('server', function() {
  describe('GET /', function() {
    it('Should return html of homepage', function(done) {
      request
        .get('/')
        .expect(200)
        .expect('Content-Type', /html/)
        .expect(/Keeping Tabs: Chrome Extension/)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        }); // just checking the existence of these text
    });
  });

  describe('Serve Chrome Extension Scripts', function() {
    
    function isJavaScript(res) {
      try {
        eval(res.text);
      } catch(e) {
        if(e instanceof SyntaxError)
          throw new Error('not javascript');
        else {
          return true;
        }
      }
    }

    it('/chrome/dist/script.js', function(done) {
      request
        .get('/chrome/dist/script.js')
        .expect(isJavaScript)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('/chrome/dist/vendors.js', function(done) {
      request
        .get('/chrome/dist/vendors.js')
        .expect(isJavaScript)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe('API', function() {
    it('POST /links', function(done) {
      request
        .post('/links')
        .send({ urls: ['http://apple.com'] })
        .expect(201, done);
    });
  });


  describe('database tests', function () {
    var users = ['louie, jake, ivan, justin'];

    var urls = [
      'https://www.google.com',
      'https://www.amazon.com',
      'https://www.facebook.com',
      'https://www.paypal.com',
      'https://www.github.com',
      'https://www.slack.com',
      'https://www.wikipedia.com',
      'https://www.dictionary.com',
      'https://www.ebay.com',
      'https://www.cnn.com'
    ];

    var usersUrls = {
      0: [0, 1, 3, 4, 6, 8],
      1: [1, 2, 3, 5, 6, 9],
      2: [0, 1, 2, 5, 7, 8],
      3: [0, 2, 5, 7, 8, 9]
    };
    var userIndex = 0;
    it('POST /links', function(done) {
      request
      .post('/links')
      // .send({ urls: ['http://google.com'] })
      .send({ urls: usersUrls[userIndex].map(function (urlIndex) {return urls[urlIndex];}) })
      .expect(201, done);
    });
  });



});