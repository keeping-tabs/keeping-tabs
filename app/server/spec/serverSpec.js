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
    it('POST /api/links', function(done) {
      request
        .post('/api/links')
        .send({ urls: ['http://apple.com'] })
        .expect(201, done);
    });
  });


  describe('database tests', function () {
    var usernames = ['louie', 'jake', 'justin', 'ivan'];
    var users = {louie: {}, jake: {}, ivan: {}, justin: {}};

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
      louie: [0, 1, 6, 8],
      jake: [3, 5, 6, 9],
      justin: [0, 1, 2, 4],
      ivan: [2, 5, 7, 9]
    };


    for (var user in users) {
      users[user].urls = usersUrls[user].map(function (urlIndex) {return urls[urlIndex];});
    }
    


    var userIndex = 0;
    it('initialize the user data', function(done) {
      // recursively post the testing user data
      var postUser = function (user) {
        request
        .post('/links')
        .send(users[user])
        .expect(201, function () {
          if (usernames.length > 0) {
            postUser(usernames.shift());
          } else {
            done();
          }
        });
      };
      postUser(usernames.shift());
    });
  });



});