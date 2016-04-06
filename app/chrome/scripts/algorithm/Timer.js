var removeTab = function(){
  var tab = this.dequeue();
  chrome.tabs.remove(tab.key);
  initializeTimer.call(this);
};

var timer;
//timer is set here for now because I want access to it on my initializeTimer function

var userTimeLimit;
//userTimeLimit will be set by user somewhere

var initializeTimer = function(){
  if(timer){
    clearTimeout(timer);
  }
  if(this.first === -1){
    return null;
  }
  var elapsedTime = (new Date()).getTime() - this.structure[this.first].data.createdAt;
  //I'm naming it queue.structure[this.first].data.createdAt for now, can be named something else eventually
  var timeRemaining = userTimeLimit - elapsedTime;
  if(timeRemaining <= 0){
    removeTab.call(this);
  }
  else{
    timer = setTimeout(removeTab.bind(this), timeRemaining);
  }
};


