var removeTab = function(){
	this.dequeue();
	initializeTimer.call(this);
};

var timer;
var userTime;

var initializeTimer = function(){
	if(timer){
		clearTimeout(timer);
	}
	if(this.first !== -1){
		var elapsedTime = new Date() - this.structure[this.first].data.createdAt;
		var timeRemaining = userTime - elapsedTime;
		if(timeRemaining <= 0){
			removeTab.call(queue);
		}
		else{
			timer = setTimeout(removeTab.bind(queue), timeRemaining);
		}
	}
	else{
		return;
	}
};