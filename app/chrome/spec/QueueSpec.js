
var assert = chai.assert;
chai.should();
var expect = chai.expect;


describe('Queue tests:', function () {
	it('The Queue constructor should be a function', function () {
		Queue.should.be.a('function');
	});
	it('The Queue constructor should be a function', function () {
		Queue.should.be.a('function');
	});
	it('A queue should be an instance of the Queue constructor', function () {
    assert.equal((new Queue()) instanceof Queue, true);
	});
	it('enqueue should store data and dequeue should retrieve it', function () {
  	var queue = new Queue();
  	var key = 'a';
  	var data = {key: true};
  	queue.enqueue(key, data);
  	var obj = queue.dequeue();
    obj.key.should.equal(key);
    obj.data.should.equal(data);
	});
	it('dequeue of an empty queue should return null', function () {
    assert.equal((new Queue()).dequeue(), null);
	});
	it('the queue should retrieve data with a first in first out method', function () {
  	var queue = new Queue();
  	var key1 = 'a', data1 = {key1: true};
  	var key2 = 'b', data2 = {key2: true};
  	var key3 = 'c', data3 = {key3: true};
  	queue.enqueue(key1, data1);
  	queue.enqueue(key2, data2);
  	queue.enqueue(key3, data3);

  	queue.dequeue().data.should.equal(data1); 
  	queue.dequeue().data.should.equal(data2); 
		queue.dequeue().data.should.equal(data3);
	});
	it('the delete method should remove the item from the queue', function () {
  	var queue = new Queue();
  	var key1 = 'a', data1 = {key1: true};
  	var key2 = 'b', data2 = {key2: true};
  	var key3 = 'c', data3 = {key3: true};
  	queue.enqueue(key1, data1);
  	queue.enqueue(key2, data2);
  	queue.enqueue(key3, data3);

  	queue.delete(key2);

  	queue.dequeue().data.should.equal(data1);
  	queue.dequeue().data.should.equal(data3);
	});
	it('the update method should move the item to the end of the queue', function () {
  	var queue = new Queue();
  	var key1 = 'a', data1 = {key1: true};
  	var key2 = 'b', data2 = {key2: true};
  	var key3 = 'c', data3 = {key3: true};
  	queue.enqueue(key1, data1);
  	queue.enqueue(key2, data2);
  	queue.enqueue(key3, data3);
    data4 = {key2: false};
  	queue.update(key2, data4);

  	queue.dequeue().data.should.equal(data1);
  	queue.dequeue().data.should.equal(data3);
  	queue.dequeue().data.should.equal(data4);
	});
	it('enqueue should throw an error on missing key or data', function () {
    var queue = new Queue();
    expect(function () {queue.enqueue()}).to.throw(Error);
	});
	it('enqueue should throw an error on incorrect key type', function () {
    var queue = new Queue();
    expect(function () {
    	queue.enqueue(['not a string'], ['someData'])
    }).to.throw(Error);
	});
	it('delete should throw an error on incorrect key type', function () {
    var queue = new Queue();
    expect(function () {queue.delete(['not a string']);}).to.throw(Error);
	});
});
