var expect = require('chai').expect;
var server = require('../../index.js');
var supertest = require('supertest');

var request = supertest.agent(server);

describe('server', function() {
  describe('GET /', function() {
    it('should return html of homepage', function() {
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
});