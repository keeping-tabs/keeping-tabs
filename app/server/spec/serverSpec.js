var expect = require('chai').expect;
var server = require('../../index.js');
var supertest = require('supertest');

var request = supertest.agent(server);
var db = require('../database.js');
/*global beforeEach, afterEach, describe, expect, it, spyOn, xdescribe, xit */

describe('server', function() {
  describe('Homepage', function() {
    it('GET / Should return html of homepage', function(done) {
      request
        .get('/')
        .expect(200)
        .expect('Content-Type', /html/)
        .expect(/Keeping Tabs/)
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

  xdescribe('API', function() {
    
    describe('Signup and Login', function() {
      it('POST /api/signup', function(done) {
        request
          .post('/api/signup')
          .send({ username: 'cat', password: 'abcd1234' })
          .expect(201, done);
      });

      it('POST /api/login', function(done) {
        request
          .post('/api/login')
          .send({ username: 'cat', password: 'abcd1234' })
          .expect(200, done);
      });
    });

    it('POST /api/links', function(done) {

      db.saveUsers([{username: 'temp', password: 'password123'}]);

      request
        .post('/api/links')
        .send({ urls: ['http://apple.com'], username: 'temp' })
        .expect(201, done);
    });
  });

  describe('Auth Module', function() {
    var auth = require('../authHandler.js');

    it('has a `signup` method', function() {
      expect(auth.signup).to.be.a('function');
    });

    it('has a `login` method', function() {
      expect(auth.login).to.be.a('function');
    });

    it('has a `authenticate` method', function() {
      expect(auth.authenticate).to.be.a('function');
    });
  });
});

xdescribe('database tests', function () {
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