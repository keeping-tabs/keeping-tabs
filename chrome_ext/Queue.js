var Queue = function(){
	this.structure = {};
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
	// use key to search thru hash table for url
	
	delete this.structure[key];
}

Queue.prototype.enqueue = function(url){
	this.last++;
	this.structure[this.last] = url;
};

Queue.prototype.dequeue = function(){
	var output = this.structure[this.first];
	this.delete(this.first);
	this.first = this.findFirst(this.first);
	return output;
};