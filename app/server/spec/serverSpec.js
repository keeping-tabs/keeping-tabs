
var chai = require('chai');
var assert = require('assert');

var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var request = require('./serverSpecRequired_request');

chai.should();
var expect = chai.expect;
var assert = chai.assert;



/* globals describe: false, it: false */
describe('Server Tests', function () {
  it('should respond to get requests at /', function () {
    return expect(new Promise(function (resolve, reject) {
      request({host: 'localhost', port: '8080', path: '/', method: 'GET'})
      .then(function (data) {resolve(data.statusCode)});
    })).to.eventually.equal(200);

  });


});