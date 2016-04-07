
/* globals chrome: false */

//assumes instance of Queue exists
var Queue = require('./Queue.js');
var Timer = require('./Timer.js');
var Chrome = require('./ChromeHelpers.js');

exports.init = function() {

  var queue = new Queue();
  var timer = Object.create(Timer);


  var currentTabs = {};

  // popup settings
  chrome.runtime.onConnect.addListener(function(port){
    if(port.name === 'popup_setting') {
      
      port.postMessage({time: timer.timeLimit}); // set UI init time
      
      port.onMessage.addListener(function(msg) {
        console.log('msg from popup: ', msg);

        timer.timeLimit = msg.time;
        console.log('time limit updated: ', timer.timeLimit);
      });
    }
  });

  chrome.tabs.onCreated.addListener(function(tab){
  	console.log('created: ', tab.id);
    Chrome.setData(tab)
    .then(function (dataObj) {
    	// var oldTab = currentTab;
      Chrome.updateCurrentTabs(queue, currentTabs)
      .then(Chrome.getActiveTabs)
      .then(Chrome.mapToTabIds)
      .then(function (tabIds) {
        Chrome.findOldTabId(tabIds, currentTabs);
      })
      .then(function (oldTabId) {
        // console.log('created: ', dataObj.tab.id);
        currentTabs[dataObj.tab.id] = dataObj;
        if (oldTabId) {
          var oldTab = currentTabs[oldTabId];
          delete currentTabs[oldTabId];

          queue.enqueue(String(oldTab.tab.id), oldTab.data);
          timer.initialize(queue);
        }
      });
    });
  });

  chrome.tabs.onUpdated.addListener(function(tabId){
    Chrome.getTab(tabId)
    .then(Chrome.setData)
    .then(function (dataObj) {
      console.log('updated the tab: ', dataObj.tab.id);
      console.log('updated: ', dataObj.tab.id);
      currentTabs[dataObj.tab.id] = dataObj;
    });
  });

  chrome.tabs.onActivated.addListener(function(activeInfo){
  	// find tab in queue using tabId (given in activeInfo),
    var tabId = activeInfo.tabId;

    Chrome.getTab(tabId)
    .then(Chrome.setData)
    .then(function (dataObj) {
      console.log('activated', dataObj.tab.id);

      Chrome.updateCurrentTabs(queue)
      .then(Chrome.getActiveTabs)
      .then(Chrome.mapToTabIds)
      .then(function (tabIds) {return Chrome.findOldTabId(tabIds, currentTabs);})
      .then(function (oldTabId) {
        console.log('oldTabId: ', oldTabId);
        console.log('activated: ', dataObj.tab.id);
        currentTabs[dataObj.tab.id] = dataObj;
        if (oldTabId) {
          var oldTab = currentTabs[oldTabId];
          delete currentTabs[oldTabId];

          queue.delete(String(dataObj.tab.id));
          queue.update(String(oldTab.tab.id), oldTab.data);
          timer.initialize(queue);
        }
      });
    });
  });

  chrome.tabs.onRemoved.addListener(function(tabId){
  	queue.delete(String(tabId));
    timer.initialize(queue);
  });
    
};