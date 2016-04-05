// mocha + chai testing requirements
var chai = require('chai');
// var assert = require('assert');//load mocha assert
var chaiAsPromised = require('chai-as-promised');
// mocha + chai testing middleware
chai.use(chaiAsPromised);
chai.should();
var expect = chai.expect;
// assert = chai.assert;//uncomment to use chai assert
// http requests node helper
var request = require('./serverSpecRequired_request');


/* globals describe: false, it: false */
describe('Server Tests', function () {
  it('should respond to get requests at /', function () {
    return expect(new Promise(function (resolve, reject) {
      request({host: 'localhost', port: '8080', path: '/', method: 'GET'})
      .then(function (data) {resolve(data.statusCode);})
      .catch(reject);
    })).to.eventually.equal(200);

  });


});