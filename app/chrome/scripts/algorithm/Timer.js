
var Timer = {
  timeout: setTimeout(function() {}, 0),
  timeLimit: 1000 * 15,// 1000 * 60 * 60 * 3, //default 3 hr timelimit
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
    // console.log(tab, ' : was dequeued');

    chrome.tabs.query({'active':true}, function (tabs) {
      if( 
        !(tabs
        .map(function(tab){return tab.id;})
        .some(function (id) {return tab.key === String(id);}))
      ) {
        chrome.tabs.remove(Number(tab.key));
      }
    });
    
    
    var tab = queue.dequeue();
    console.log('Dequeued Tab: ', tab);
    this.initialize(queue);
  }
};

if (typeof require === 'function') {
  module.exports = Timer;
}

