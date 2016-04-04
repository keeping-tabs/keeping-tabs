var removeTab = function(){
	this.dequeue();
	initializeTimer.call(this);
};

var timer;
var userTimeLimit;

var initializeTimer = function(){
	if(timer){
		clearTimeout(timer);
	}
	if(this.first === -1){
		return null;
	}
	var elapsedTime = (new Date()).getTime() - this.structure[this.first].data.createdAt;
	var timeRemaining = userTimeLimit - elapsedTime;
	if(timeRemaining <= 0){
		removeTab.call(this);
	}
	else{
		timer = setTimeout(removeTab.bind(this), timeRemaining);
	}
};


