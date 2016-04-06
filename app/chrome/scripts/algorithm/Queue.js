var Queue = (function() {
  return function() {
    var storage = {};
    var hash = {};
    this.first = -1;
    this.last = -1;

    var setFirst = function() {
      while (!storage[this.first]) {
        this.last = this.last === this.first ? this.first = -1 : this.last;
        if (this.last === -1) {
          break;
        }
        this.first++;
      }
    };

    this.enqueue = function(key, data) {
      if (!key || !data) {
        throw new Error('Queue.enqueue expects both key and data arguments');
      }
      if (typeof key !== 'string') {
        throw new Error('Queue.enqueue expects the key argument to be a string');
      }
      this.last++;
      this.first = this.first === -1 ? this.last : this.first;
      hash[key] = this.last;
      storage[this.last] = {
        key: key,
        data: data
      };
    };

    this.dequeue = function() {
      if (this.first === -1) {
        return null;
      }
      var obj = storage[this.first];
      delete storage[this.first];
      delete hash[obj.key];
      setFirst.call(this);
      return obj;
    };


    this.delete = function(key) {
      if (typeof key !== 'string') {
        throw new Error('Queue.delete expects the key argument to be a string');
      }
      var index = hash[key];
      delete storage[index];
      delete hash[key];
      if (this.first === index) {
        setFirst.call(this);
      }
    };

    this.update = function(key, data) {
      this.delete(key);
      this.enqueue(key, data);
    };
  };
})();
module.exports = Queue;