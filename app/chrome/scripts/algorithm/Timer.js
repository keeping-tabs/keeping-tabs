
var Timer = {
  timeout: setTimeout(function() {}, 0),
  timeLimit: 1000 * 60 * 60 * 3, //default 3 hr timelimit
  initialize: function (queue) {
    clearTimeout(this.timeout);
    if(queue.first === -1){
      // console.log('the queue is now empty');
      return null;
    }
    var elapsedTime = Date.now() - queue.storage[queue.first].data.createdAt;
    //I'm naming it queue.storage[queue.first].data.createdAt for now, can be named something else eventually
    var timeRemaining = this.timeLimit - elapsedTime;
    if(timeRemaining <= 0){
      this.removeTab(queue);
    }
    else{
      this.timeout = setTimeout(this.removeTab.bind(this,queue), timeRemaining);
    }
  },
  removeTab: function (queue) {
    var tab = queue.dequeue();
    // console.log(tab, ' : was dequeued');
    // chrome.tabs.remove(tab.key);
    this.initialize(queue);
  }
};

if (typeof require === 'function') {
  module.exports = Timer;
}

