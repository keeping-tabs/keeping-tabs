
/* globals chrome: false */
var Chrome = require('./ChromeHelpers.js');

// var localStorage = localStorage ? localStorage : {keepingTabs: {}};

// var localData = localStorage ? JSON.parse(localStorage.keepingTabs) : {};

var Timer = {
  isActive: false,
  timeout: setTimeout(function() {}, 0),
  // timeLimit: localData.time ? localData.time : 1000 * 60 * 60, //default 60 mins timelimit
  timeLimit: 1000 * 60 * 60, //default 60 mins timelimit
  initialize: function (queue, time) {
    // console.log('initialize timer');
    // console.log('time limit: ', this.timeLimit);
    // console.log('queue: ', queue);

    clearTimeout(this.timeout);
    this.isActive = true;
  
    this.timeLimit = time || this.timeLimit;

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
  deactivate: function() {
    clearTimeout(this.timeout);
    this.isActive = false;
  },
  removeTab: function (queue) {
    var tab = queue.dequeue();

    // console.log(tab, 'TABID');

    try {
      // chrome.tabs.query({'active':true}, function (tabs) {
        // if( 
          // first check if the dequeued tab if available in all the tabs
          // then check if the dequeued tab is not active in a window

          // console.log('try');

          Chrome.getAllTabs()
          .then(Chrome.mapToTabIds)
          .then(function (tabIds) {
// console.log('reaching the contains');

            return Chrome.containsId(tabIds, Number(tab.key));
          })
          .then(function (bool) {
            // console.log('tab exists in all tabs: ' + bool);
            if (bool) {
              Chrome.getActiveTabs()
              .then(Chrome.mapToTabIds)
              .then(function (tabIds) {
                return Chrome.containsId(tabIds, Number(tab.key));
              })
              .then(function (bool) {
                // console.log('tab is active: ' + bool);
                if (!bool) {
                  chrome.tabs.remove(Number(tab.key));
                  Chrome.postTabs([tab.data.url], JSON.parse(localStorage.keepingTabs).username);
                }
              });
            }
          });


    } catch (error) {

    }
    
    // console.log('Dequeued Tab: ', tab);
    this.initialize(queue);
  }
};

  module.exports = Timer;

