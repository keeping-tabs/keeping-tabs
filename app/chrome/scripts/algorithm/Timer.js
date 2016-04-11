
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
    if (tab !== null) {
      var tabId = Number(tab.key);

      Chrome.isTabStillOpen(tabId)
      .then(function (bool) {
        // console.log(bool);
        // console.log(tab);
        if (bool) {
          chrome.tabs.remove(tabId);
          Chrome.postTabs([tab.data.url], JSON.parse(localStorage.keepingTabs).username);
          return Promise.resolve('tab: ' + tab.data.url + ' : was posted to the server');
        }
      })
      .then(function log (message) {
        console.log(message);
      })
      .catch(function (error) {
        console.error(error);
      });
      
      this.initialize(queue);
    }
  }
};

  module.exports = Timer;

