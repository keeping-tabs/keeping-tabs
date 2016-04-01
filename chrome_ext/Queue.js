var Queue = function(){
	this.structure = {};
	this.hashTable = {};
	this.first = -1;
	this.last = -1;
};

Queue.prototype.findFirst = function(index){
	if(index > this.last){
		this.last = -1;
		return -1;
	}
	if(!this.structure[index]){
		return this.findFirst(index + 1);
	}
	return index;
};

Queue.prototype.delete = function(key){
	var index = this.hashTable[key]
	delete this.hashTable[index];
	delete this.structure[index];
};

Queue.prototype.enqueue = function(key, data){
	this.last++;
	this.structure[this.last] = {key: key, data: data};
	this.hashTable[key] = this.last;
	if(this.first === -1){
		this.first = this.last;
	}
};

Queue.prototype.dequeue = function(){
	if(this.first === -1){
		return null;
	}
	var output = this.structure[this.first];
	this.delete(output.key);
	this.first = this.findFirst(this.first);
	return output;
};

Queue.prototype.update = function(key, data){
	var index = this.hashTable[key];
	this.delete(key);
	this.enqueue(key, data);
};


