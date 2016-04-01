console.log(
  'Queue tests',
  '\n',

  typeof Queue === 'function',
  ' : The Queue constructor should be a function',
  '\n',

  (new Queue) instanceof Queue,
  ' : A queue should be an instance of the Queue constructor',
  '\n',

  (function () {
  	var queue = new Queue();
  	var key = 'a';
  	var data = {key: true};
  	queue.enqueue(key, data);
  	var obj = queue.dequeue();
    return obj.key === key && obj.data === data;
  })(),
  ' : enqueue should store data and dequeue should retrieve it',
  '\n',

  (new Queue()).dequeue() === null,
  ' : dequeue of an empty queue should return null',
  '\n',

  (function () {
  	var queue = new Queue();
  	var key1 = 'a', data1 = {key1: true};
  	var key2 = 'b', data2 = {key2: true};
  	var key3 = 'c', data3 = {key3: true};
  	queue.enqueue(key1, data1);
  	queue.enqueue(key2, data2);
  	queue.enqueue(key3, data3);

  	return queue.dequeue().data === data1 
  		&& queue.dequeue().data === data2 
  		&& queue.dequeue().data === data3;
  })(),
  ' : the queue should retrieve data with a first in first out method',
  '\n',

  (function () {
  	var queue = new Queue();
  	var key1 = 'a', data1 = {key1: true};
  	var key2 = 'b', data2 = {key2: true};
  	var key3 = 'c', data3 = {key3: true};
  	queue.enqueue(key1, data1);
  	queue.enqueue(key2, data2);
  	queue.enqueue(key3, data3);

  	queue.delete(key2);

  	return queue.dequeue().data === data1 
  		&& queue.dequeue().data === data3;
  })(),
  ' : the delete method should remove the item from the queue',
  '\n',

  (function () {
  	var queue = new Queue();
  	var key1 = 'a', data1 = {key1: true};
  	var key2 = 'b', data2 = {key2: true};
  	var key3 = 'c', data3 = {key3: true};
  	queue.enqueue(key1, data1);
  	queue.enqueue(key2, data2);
  	queue.enqueue(key3, data3);
    data2[key2] = false;
  	queue.update(key2, data2);

  	return queue.dequeue().data === data1 
  		&& queue.dequeue().data === data3
  		&& queue.dequeue().data === data2;
  })(),
  ' : the update method should move the item to the end of the queue',
  '\n',

  (function () {
  	var queue = new Queue();
  	var errorOccured = [false, false];
  	try {
      queue.enqueue();
  	} catch (error) {
      errorOccured[0] = true
  	}
  	try {
      queue.enqueue('someKey');
  	} catch (error) {
      errorOccured[1] = true
  	} 
  	return errorOccured.every(function (val) {return val === true;});
  })(),
  ' : enqueue should throw an error on missing key or data',
  '\n',

    (function () {
  	var queue = new Queue();
  	var errorOccured = false;
  	try {
      queue.enqueue(['not a string'], ['someData']);
  	} catch (error) {
      errorOccured = true
  	}
  	return errorOccured;
  })(),
  ' : enqueue should throw an error on incorrect key type',
  '\n',

    (function () {
  	var queue = new Queue();
  	var errorOccured = false;
  	try {
      queue.delete(['not a string']);
  	} catch (error) {
      errorOccured = true
  	}
  	return errorOccured;
  })(),
  ' : delete should throw an error on incorrect key type',
  '\n',




  'end'
);