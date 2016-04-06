// mocha + chai testing requirements
var chai = require('chai');
var assert = require('assert');//load mocha assert
var chaiAsPromised = require('chai-as-promised');
// mocha + chai testing middleware
chai.use(chaiAsPromised);
chai.should();
var expect = chai.expect;
assert = chai.assert;

var Timer = require('../scripts/algorithm/Timer.js');
var Queue = require('../scripts/algorithm/Queue.js');

describe('Timer tests:', function () {
  it('The Timer constructor should be an object', function () {
    Timer.should.be.an('object');
  });
  xit('time should have a timeLimit property', function () {
    Object.create(Timer).should.have.property('timeLimit');
    Object.create(Timer).timeLimit.should.equal(1000 * 60 * 60 * 3);//3 hours
  });
  it('timer should have a removeTab method', function () {
    Object.create(Timer).should.have.property('removeTab');
    Object.create(Timer).removeTab.should.be.a('function');
  });
  it('timer should have an initialize method', function () {
    Object.create(Timer).should.have.property('initialize');
    Object.create(Timer).initialize.should.be.a('function');
  });
  it('removeTab should throw an error when it is called without a queue argument', function () {
    expect(function () {Object.create(Timer).removeTab('notAQueue');}).to.throw(Error);
  });
  it('initialize should throw an error when it is called without a queue argument', function () {
    expect(function () {Object.create(Timer).initialize('notAQueue');}).to.throw(Error);
  });

});
describe('Timer-Queue Integration Tests: ', function () {
  it('removeTab should remove the first item in the queue', function () {
    var queue = new Queue ();
    queue.enqueue('first', {data: 'first data', createdAt: Date.now()});
    var timer = Object.create(Timer);
    timer.removeTab(queue);
    assert.equal(queue.dequeue(), null);
  });
  it('initialize should remove the tab when it has expired', function () {
    var queue = new Queue ();
    var now = Date.now();
    queue.enqueue('first', {data: 'first data', createdAt: now});
    var timer = Object.create(Timer);
    timer.timeLimit = 1000;
    timer.initialize(queue);

    assert.notEqual(queue.first, -1);//should actually be null when linked list is used
    return expect(new Promise(function (resolve, reject) {
      var notYetDequeued = false;

      setTimeout(function () {notYetDequeued = queue.first > -1 ? true : false;}, 998 - (Date.now() - now));
      setTimeout(function () {resolve(notYetDequeued && (queue.first === -1));}, 1001);
    })).to.eventually.equal(true);//should actually be null when linked list is used
  });
  it('initialize should continue to remove tabs as they expire', function () {

  return expect(

    generateQueueData(new Queue())
    .then(function (queue) {

      var timer = Object.create(Timer);
      timer.timeLimit = 500;
      timer.initialize(queue);
      storage = storage.filter(function (element) {
        return Date.now() - element[1].createdAt < 500;
      });
      if (queue.first !== (pseudoStorage.length - storage.length)) {
        reject('initialize and removeTab behaving in unexpected way #1');
      }
      return new Promise(function (resolve, reject) {
        var notYetDequeued = false;         
        setTimeout(function () {
          if(queue.first !== (pseudoStorage.length - storage.length)) {
            reject('initialize and removeTab behaving in unexpected way #2,' + ' -- ' + queue.first +' -- '+ pseudoStorage.length + ' -- ' + storage.length);
          }
        }, 499 - (Date.now() - storage[0][1].createdAt));
        setTimeout(function () {
          storage = storage.filter(function (element) {
            return (Date.now() - element[1].createdAt) < 500;
          });
          resolve(queue.first === (pseudoStorage.length - storage.length));
        }, 525 - (Date.now() - storage[0][1].createdAt));
        // timeout for 25ms longer in case multiple tabs need to be removed
      
      });

    })
  ).to.eventually.equal(true);

  });
});


var pseudoStorage = [
  ['google',{url: 'www.google.com'}],
  ['facebook',{url: 'www.facebook.com'}],
  ['amazon',{url: 'www.amazon.com'}],
  ['github',{url: 'www.github.com'}],
  ['slack',{url: 'www.slack.com'}],
  ['paypal',{url: 'www.paypal.com'}]
];
var storage = [];

var generateQueueData = function (queue) {
  // console.log('Queue is being generated');
  return new Promise(function(resolve, reject){

    try{
      var max = 0;
      pseudoStorage.forEach(function (val) {
        var timeout = Math.floor(Math.random() * 1000);
        max = max > timeout ? max : timeout;
        setTimeout(function () {
          val[1].createdAt = Date.now();
          queue.enqueue(val[0], val[1]);
          storage.push(val);
        }, timeout);
      });
      setTimeout(function () {resolve(queue);}, max);

    } catch (error) {reject(error);}
  });
};


