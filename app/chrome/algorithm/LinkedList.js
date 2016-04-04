var Link = function (data) {
  this.data = data;
  this.next = null;
  this.previous = null;
};

var LinkedList = function () {
	this.head = null;
	this.tail = null;
};

LinkedList.prototype.push = function (link) {
  if (!(link instanceof Link)){
    throw new Error('the link argument must be an instance of the Link constructor');
  }
	// adds an item to the end of the list
  if (this.tail === null) {
  	this.head = this.tail = link;
  } 
  else {
  	var previous = this.tail;
  	this.tail.next = this.tail = link;
  	this.tail.previous = previous;
  }
};

LinkedList.prototype.pop = function () {
		var output = this.tail;
		if (this.head === this.tail) {
      this.head = this.tail = null;
 	  } else {
		  this.tail = this.tail.previous;
		  this.tail.next=null;
 	  }
 	  return output;
};

LinkedList.prototype.shift = function () {
  // removes the first item in the list
  var output = this.head;
  if (this.head === this.tail) {
  	this.head = this.tail = null;
  } else {
  	this.head = this.head.next;
  	this.head.previous = null;
  }
  return output;
};

LinkedList.prototype.unshift = function (link) {
  if (!(link instanceof Link)){
    throw new Error('the link argument must be an instance of the Link constructor');
  }
  // adds an item to the front of the list
  if (this.head === null) {
  	this.head = this.tail = link;
  } 
  else {
  	var next = this.head;
  	this.head.previous = this.head = link;
    this.head.next = next;
  }
};
