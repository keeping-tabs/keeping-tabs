
/* globals chrome: false */

//assumes instance of Queue exists
var Queue = require('./Queue.js');
var Timer = require('./Timer.js');
var Chrome = require('./ChromeHelpers.js');

exports.init = function() {

  var queue = new Queue();
  var timer = Object.create(Timer);

  var currentTabs = {};

  addAllListeners();

  // popup settings
  chrome.runtime.onConnect.addListener(function(port){
    if(port.name === 'popup_setting') {

      port.postMessage({ // UI init settings
        time: timer.timeLimit,
        active: true // hard code need to refactor Timer module
      });
      
      port.onMessage.addListener(function(msg) {

        console.log('msg from popup: ', msg);
        
        if(msg.time !== undefined) {
          timer.timeLimit = msg.time;
          console.log('time limit updated: ', timer.timeLimit);
          port.postMessage({time: timer.timeLimit}); // respond with new time
        }
        
        if(msg.active !== undefined) {
          if(!msg.active) {
            removeAllListeners();
            timer.deactivate();
            port.postMessage({active: false});
          } else {
            addAllListeners();
            timer.initialize(queue);
            port.postMessage({active: true});
          }
          console.log('extension active: ', msg.active);
        }
      });
    }
  });

  function addAllListeners() {
    chrome.tabs.onCreated.addListener(handleOnCreated);
    chrome.tabs.onUpdated.addListener(handleOnUpdated);
    chrome.tabs.onActivated.addListener(handleOnActivated);
    chrome.tabs.onRemoved.addListener(handleOnRemoved);
  }

  function removeAllListeners() {
    chrome.tabs.onCreated.removeListener(handleOnCreated);
    chrome.tabs.onUpdated.removeListener(handleOnUpdated);
    chrome.tabs.onActivated.removeListener(handleOnActivated);
    chrome.tabs.onRemoved.removeListener(handleOnRemoved);
  }

  function handleOnCreated(tab){
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
  }

  function handleOnUpdated(tabId){
    Chrome.getTab(tabId)
    .then(Chrome.setData)
    .then(function (dataObj) {
      console.log('updated the tab: ', dataObj.tab.id);
      console.log('updated: ', dataObj.tab.id);
      currentTabs[dataObj.tab.id] = dataObj;
    });
  }

  function handleOnActivated(activeInfo){
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
  }

  function handleOnRemoved(tabId){
    queue.delete(String(tabId));
    timer.initialize(queue);
  }
    
};