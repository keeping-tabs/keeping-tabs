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
});