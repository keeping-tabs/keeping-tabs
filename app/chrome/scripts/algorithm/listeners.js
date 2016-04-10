
/* globals chrome: false */

localStorage.keepingTabs = localStorage.keepingTabs ? localStorage.keepingTabs : '{}';


//assumes instance of Queue exists
var Queue = require('./Queue.js');
var Timer = require('./Timer.js');
var Chrome = require('./ChromeHelpers.js');

exports.init = function() {

  var queue = new Queue();
  var timer = Object.create(Timer);
  var localData = JSON.parse(localStorage.keepingTabs);
  timer.timeLimit = localData.time ? localData.time : 1000 * 60 * 60;

  var currentTabs = {};

  addAllListeners();

  // popup settings
  chrome.runtime.onConnect.addListener(function(port){
    if(port.name === 'popup_setting') {
      var localData = JSON.parse(localStorage.keepingTabs);
// console.log('localData:', localData);
    port.postMessage({ // UI init settings
      time: localData.time ? localData.time : timer.timeLimit,
      active: localData.active ? localData.active : false,
      username: localData.username ? localData.username : false
    });
      
      port.onMessage.addListener(function(msg) {

        console.log('msg from popup: ', msg);
        
        if(msg.time !== undefined) {
          timer.timeLimit = msg.time;
          console.log('time limit updated: ', timer.timeLimit);
          Chrome.setLocalStorage({time: msg.time});
          port.postMessage({time: timer.timeLimit}); // respond with new time
        }
        
        if(msg.active !== undefined) {
          if(!msg.active) {
            removeAllListeners();
            timer.deactivate();
            console.log('set chrome to inactive');
            Chrome.setLocalStorage({active: false});
            port.postMessage({active: false});
          } else {
            addAllListeners();
            timer.initialize(queue);
            Chrome.setLocalStorage({active: true});
            port.postMessage({active: true});
          }
          console.log('extension active: ', msg.active);
        }
        if(msg.username !== undefined) {
          console.log('set username: ', msg.username);
          // _settings.username = msg.username;
          Chrome.setLocalStorage({username: msg.username});
          port.postMessage(msg);
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
    // console.log('created: ', tab.id);
    // currentTabs[tab.id] = true;
    // console.log('current tabs: ', currentTabs);
    // // Chrome.setData(tab)
    // // .then(function (dataObj) {
    //   // var oldTab = currentTab;
    //   Chrome.updateCurrentTabs(queue, currentTabs)
    //   .then(Chrome.getActiveTabs)
    //   .then(Chrome.mapToTabIds)
    //   .then(function (tabIds) {
    //     return Chrome.findOldTabId(tabIds, currentTabs);
    //   })
    //   .then(function (oldTabId) {
    //     if (oldTabId) {
    //       // console.log(oldTabId);
    //       return Chrome.getTab(Number(oldTabId))
    //       .then(Chrome.setData)
    //       .then(function (dataObj) {
    //         // console.log('created: ', dataObj.tab.id);
    //         currentTabs[oldTabId] = dataObj;
    //           var oldTab = currentTabs[oldTabId];
    //           delete currentTabs[oldTabId];

    //           queue.enqueue(String(oldTab.tab.id), oldTab.data);
    //           timer.initialize(queue);
    //       });
    //     }
    //   });
    // // });
  }

  function handleOnUpdated(tabId){
    // Chrome.getTab(tabId)
    // .then(Chrome.setData)
    // .then(function (dataObj) {
    //   console.log('updated the tab: ', dataObj.tab.id);
    //   console.log('updated: ', dataObj.tab.id);
    //   currentTabs[dataObj.tab.id] = dataObj;
    // });
  }

  function handleOnActivated(activeInfo){
    var tabId = activeInfo.tabId;

    currentTabs[tabId] = true;

    // console.log(currentTabs);

    // Chrome.updateCurrentTabs(queue)//this will remove tabs from the queue and the currentTabs object if they are no longer open
    Chrome.getActiveTabs()
    .then(Chrome.mapToTabIds)
    .then(function (activeTabIds) {
      var oldTabId = null;
      for (var tabId in currentTabs) {
        if(
          !activeTabIds.some(function (activeTabId) {
            return activeTabId === Number(tabId);
          })
        ) {
          oldTabId = Number(tabId);
        }
      }
      return Promise.resolve(oldTabId);
    })
    // .then(function (tabIds) {
    //   console.log('active tabs: ', tabIds);
    //   return Chrome.findOldTabId(tabIds, currentTabs);
    // })
    .then(function (oldTabId) {
      // console.log('compare tab ids:', oldTabId, tabId);
      if (oldTabId !== tabId && oldTabId !== null) {
        // make sure the old tab is not equal to the new tab
        // make sure the old tab is not null
        // console.log('oldTab: ', oldTabId);
        
        // make sure the old tab was not closed
        return Chrome.getAllTabs()
        .then(Chrome.mapToTabIds)
        .then(function (allTabIds) {
          var bool = allTabIds.some(function (tabId) {
            return tabId === oldTabId;
          });
          if (bool) {
            return Chrome.getTab(oldTabId)
            .then(Chrome.setData)
            .then(function (dataObj) {
              // console.log('created: ', dataObj.tab.id);
              // currentTabs[oldTabId] = dataObj;
              // var oldTab = currentTabs[oldTabId];
              delete currentTabs[oldTabId];
              queue.delete(String(oldTabId));

              queue.enqueue(String(oldTabId), dataObj.data);
              timer.initialize(queue);
              return Promise.resolve('queued tab#' + oldTabId);
            });
          }
        });
      }
    })
    .then(function (message) {
      console.log(message);
    })
    .catch(function (error) {
      console.error(error);
    });







    // // find tab in queue using tabId (given in activeInfo),
    // var tabId = activeInfo.tabId;

    // // Chrome.getTab(tabId)
    // // .then(Chrome.setData)
    // // .then(function (dataObj) {
    //   // console.log('activated', dataObj.tab.id);
    //   currentTabs[tabId] = true;

    //   Chrome.updateCurrentTabs(queue)
    //   .then(Chrome.getActiveTabs)
      // .then(Chrome.mapToTabIds)
      // .then(function (tabIds) {return Chrome.findOldTabId(tabIds, currentTabs);})
    //   .then(function (oldTabId) {
    //     // console.log('oldTabId: ', oldTabId);
    //     // console.log('activated: ', dataObj.tab.id);
    //     if (oldTabId) {
    //       // console.log(oldTabId);
    //       return Chrome.getTab(Number(oldTabId))
    //       .then(Chrome.setData)
    //       .then(function (dataObj) {
    //         // console.log('created: ', dataObj.tab.id);
    //         currentTabs[oldTabId] = dataObj;
    //           var oldTab = currentTabs[oldTabId];
    //           delete currentTabs[oldTabId];
    //           queue.delete(String(dataObj.tab.id));

    //           queue.enqueue(String(oldTab.tab.id), oldTab.data);
    //           timer.initialize(queue);
    //       });
        // }

        
        // currentTabs[dataObj.tab.id] = dataObj;
        // if (oldTabId) {
        //   var oldTab = currentTabs[oldTabId];
        //   delete currentTabs[oldTabId];

        //   queue.update(String(oldTab.tab.id), oldTab.data);
        //   timer.initialize(queue);
        // }
      // });
    // });
  }

  function handleOnRemoved(tabId){
    queue.delete(String(tabId));
    timer.initialize(queue);
  }
    
};