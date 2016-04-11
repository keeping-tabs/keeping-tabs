
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
  
  console.log('listener init');
  chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    console.log('msg from angular client: ', request);
    console.log('sendResponse: ', sendResponse);
    
    Chrome.setLocalStorage(request);
  });

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
        if(msg['sign-out'] !== undefined) {
          console.log('signout ');
          // _settings.username = msg.username;
          // Chrome.setLocalStorage({username: msg.username});
          localStorage.keepingTabs = '{}';
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
    Chrome.tabHasLoaded(tab)
    .then(Chrome.isTabActive)
    .then(function (bool) {

      // console.log(bool, ' : new tab is active');
      if (!bool) {
        //created tab is not active. So enqueue it
        queue.enqueue(String(tab.id), Chrome.data(tab));
        timer.initialize(queue);
      }
      return Promise.resolve('queued tab ' + tab.id);
    })
    .then(function log (message) {
      console.log(message);
      return Promise.resolve(message);
    })
    .catch(function (error) {
      console.error(error);
      // return Promise.reject(error);
      return Promise.resolve();
    });
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

  var _state = {active: []};

  function difference (array1, array2, map1, map2) {
    var output = [];
    map1 = typeof map1 === 'function' ? map1 : function (element) {return element;};
    map2 = typeof map2 === 'function' ? map2 : function (element) {return element;};

    array1.forEach(function (element1) {
      var bool = array2.some(function (element2) {
        return  map1(element1) === map2(element2);
      });
      if (!bool) {
        output.push(element1);
      }
    });
    return output;
  }

  function toId (tab) { return tab.id; }

  function indetity (val) { return val; }

  function handleOnActivated(activeInfo){
    var tabId = activeInfo.tabId;
    queue.delete(String(tabId));

    Chrome.getActiveTabs()
    .then(function (activeTabs) {
      // find the last active tab by calculating the difference between the _state active tabs and the current active tabs
      var oldTab = difference(_state.active, activeTabs, toId, toId);
      console.log('state active: ', _state.active);
      console.log('active tabs: ', activeTabs);
      console.log('this is the old tab: ', oldTab);
      _state.active = activeTabs;

      if (oldTab.length > 1) {
        throw new Error('unexpected number of old tabs expected 1 instead got ' + oldTab.length);

        // if there are more than 1 oldTabs then check which one is still open
        // this case will happen if the user has manually closed an active tab in a window with just one tab
        // return Chrome.getAllTabs()
        // .then(function (allTabs) {
        //   var oldTab = oldTab.filter(function (old) {
        //     return allTabs.some(function (openTab) {
        //       return openTab === old;
        //     }); 
        //   });
        //   if (oldTab.length !== 1) {
        //    throw new Error('unexpected number of old tabs expected 1 instead got ' + oldTab.length);
        //   }
        //   var oldTab = oldTab[0];
        //   queue.enqueue(String(oldTab.id), Chrome.data(oldTab));
        //   timer.initialize(queue);          
        // });

      } 
      if (oldTab.length === 0) {
        // Do nothing. The new tab was opened in a new window.
        return Promise.resolve('no active tabs moved away from');
      } 
      if (oldTab.length === 1) {
        var oldTabId = oldTab[0].id;
        return Chrome.appendToQueue(oldTabId, queue, timer);
      } 
    })
    .then(function log (message) {
      console.log(message);
      return Promise.resolve(message);
    })
    .catch(function (error) {
      console.error(error);
      // return Promise.reject(error);
      return Promise.resolve();
    });
  }

  function handleOnRemoved(tabId){
    queue.delete(String(tabId));
    timer.initialize(queue);
  }
    
};