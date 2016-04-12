(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Link = function (data) {
  this.data = data;
  this.next = null;
  this.previous = null;
};

var LinkedList = function () {
	this.head = null;
	this.tail = null;
};

LinkedList.prototype.push = function (link) {
  if (!(link instanceof Link)){
    throw new Error('the link argument must be an instance of the Link constructor');
  }
	// adds an item to the end of the list
  if (this.tail === null) {
  	this.head = this.tail = link;
  } 
  else {
  	var previous = this.tail;
  	this.tail.next = this.tail = link;
  	this.tail.previous = previous;
  }
};

LinkedList.prototype.pop = function () {
		var output = this.tail;
		if (this.head === this.tail) {
      this.head = this.tail = null;
 	  } else {
		  this.tail = this.tail.previous;
		  this.tail.next=null;
 	  }
 	  return output;
};

LinkedList.prototype.shift = function () {
  // removes the first item in the list
  var output = this.head;
  if (this.head === this.tail) {
  	this.head = this.tail = null;
  } else {
  	this.head = this.head.next;
  	this.head.previous = null;
  }
  return output;
};

LinkedList.prototype.unshift = function (link) {
  if (!(link instanceof Link)){
    throw new Error('the link argument must be an instance of the Link constructor');
  }
  // adds an item to the front of the list
  if (this.head === null) {
  	this.head = this.tail = link;
  } 
  else {
  	var next = this.head;
  	this.head.previous = this.head = link;
    this.head.next = next;
  }
};

},{}],2:[function(require,module,exports){
var Queue = (function() {
  return function() {
    var storage = {};
    var hash = {};
    this.first = -1;
    this.last = -1;
    this.storage = storage; // for testing purposes. this should not be public

    var setFirst = function() {
      while (!storage[this.first]) {
        this.last = this.last === this.first ? this.first = -1 : this.last;
        if (this.last === -1) {
          break;
        }
        this.first++;
      }
    };

    this.enqueue = function(key, data) {
      if (!key || !data) {
        throw new Error('Queue.enqueue expects both key and data arguments');
      }
      if (typeof key !== 'string') {
        throw new Error('Queue.enqueue expects the key argument to be a string');
      }
      this.last++;
      this.first = this.first === -1 ? this.last : this.first;
      hash[key] = this.last;
      storage[this.last] = {
        key: key,
        data: data
      };
      console.log(storage)
    };

    this.dequeue = function() {
      if (this.first === -1) {
        return null;
      }
      var obj = storage[this.first];
      delete storage[this.first];
      delete hash[obj.key];
      setFirst.call(this);
      return obj;
    };


    this.delete = function(key) {
      if (typeof key !== 'string') {
        throw new Error('Queue.delete expects the key argument to be a string');
      }
      var index = hash[key];
      delete storage[index];
      delete hash[key];
      if (this.first === index) {
        setFirst.call(this);
      }
    };

    this.update = function(key, data) {
      this.delete(key);
      this.enqueue(key, data);
    };

    this.getFirst = function(){
      return storage[this.first];
    };
  };
})();


module.exports = Queue;



},{}],3:[function(require,module,exports){

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
    var tab = queue.dequeue();
// console.log(hello);
    // console.log('chrome: ', chrome);
    // var chrome = chrome;// || null;
    // console.log('chrome: ', chrome);
    if (chrome) { // this is a hack to pass the timer queue integration test because chrome wont be defined there. Instead use a callback or Promise
      chrome.tabs.query({'active':true}, function (tabs) {
        if( 
          !(tabs
          .map(function(tab){return tab.id;})
          .some(function (id) {return tab.key === String(id);}))
        ) {
          chrome.tabs.remove(Number(tab.key));
        }
      });  
    }
    
    console.log('Dequeued Tab: ', tab);
    this.initialize(queue);
  }
};

if (typeof require === 'function') {
  module.exports = Timer;
}


},{}],4:[function(require,module,exports){
//assumes instance of Queue exists
var queue = new Queue();
var timer = Object.create(Timer);


var currentTabs = {};

//////////  //////////  //////////  //////////  //////////  
// helper functions

var getTab = function (tabId) {
  return new Promise(function (resolve) {
    try {
      chrome.tabs.get(tabId, resolve);
      // resolves all tabs
    } catch (error) {
      reject(error);
    }
  });
};

var getAllTabs = function () {
  return new Promise(function (resolve, reject) {
    try{
      chrome.tabs.query({}, resolve);
    } catch (error) {
      reject(error);
    }
  });
}

var getActiveTabs = function () {
  return new Promise(function (resolve, reject) {
    try{
      chrome.tabs.query({'active':true}, resolve);
      //resolves active tabs
    } catch (error) {
      reject(error);
    }
  });
};

var setData = function (tab) {
  try {
    var data = {
      url: tab.url,
      createdAt: Date.now()
    };
  } catch (error) {
    return Promise.reject(error);
  } 
  return Promise.resolve({data:data, tab: tab});
};

var updateCurrentTabs = function (queue) {
  return new Promise(function (resolve, reject) {
    try {
      getAllTabs()
      .then(mapToTabIds)
      .then(function (tabIds) {
        for (var tabId in currentTabs) {
          containsId(tabIds, Number(tabId))
          .then(function (bool) {
            if (!bool) {
              delete currentTabs[tabId];
              queue.delete(tabId);
            }
          });
        }
        resolve(queue);
      });
    } catch (error) {
      reject(error);
    }
  });
};

var findOldTabId = function (tabIds) {
  console.log(tabIds);
  try {
    var oldTabId = Object.keys(currentTabs).filter(function (tabId) {
      return tabIds.some(function (id) {
        return String(id) !== tabId;    
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }
  if (oldTabId.length > 1) {
    return Promise.reject('Incorrect number of old tabs returned: "' + oldTabId.length + '" should be "1".');
  }
  return Promise.resolve(oldTabId[0] || null);
  //resolve the old tab id
};


var mapToTabIds = function (tabs) {
  try {
    var tabIds = tabs.map(function (tab) {return tab.id;});
  } catch (error) {
    return Promise.reject(error);
  }
  console.log(tabs, tabIds);
  return Promise.resolve(tabIds);
  // return Promise.resolve(100);
};

var containsId = function (tabIds, id) {
  try{
    var bool = tabIds.some(function (tabId) {return tabId === id;});
  } catch (error) {
    return Promise.reject(error);
  }
  return Promise.resolve(bool);
};


//////////  //////////  //////////  //////////  //////////  



chrome.tabs.onCreated.addListener(function(tab){
	console.log('created: ', tab.id);
  setData(tab)
  .then(function (dataObj) {
  	// var oldTab = currentTab;
updateCurrentTabs(queue)
.then(getActiveTabs)
.then(mapToTabIds)
.then(findOldTabId)
.then(function (oldTabId) {
  currentTabs[dataObj.tab.id] = dataObj.tab;
  if (oldTabId) {
    var oldTab = currentTabs[oldTabId];
    delete currentTabs[oldTabId];

    queue.enqueue(String(oldTab.id), dataObj.data);
    timer.initialize(queue);
  }
});



    // currentTab = dataObj.tab;
    // if (oldTab !== null) {
    //   queue.enqueue(String(oldTab.id), dataObj.data);
    //   timer.initialize(queue);
    // } 
  });
});

chrome.tabs.onUpdated.addListener(function(tabId){
  getTab(tabId)
  .then(setData)
  .then(function (dataObj) {
    console.log('updated the tab: ', dataObj.tab.id);
    currentTabs[dataObj.tab.id] = dataObj.tab;
  });
});

chrome.tabs.onActivated.addListener(function(activeInfo){
	// find tab in queue using tabId (given in activeInfo),
  var tabId = activeInfo.tabId;

  getTab(tabId)
  .then(setData)
  .then(function (dataObj) {
    console.log('activated', dataObj.tab.id);

updateCurrentTabs(queue)
.then(getActiveTabs)
.then(mapToTabIds)
.then(findOldTabId)
.then(function (oldTabId) {
  console.log('oldTabId: ', oldTabId);
  currentTabs[dataObj.tab.id] = dataObj.tab;
  if (oldTabId) {
    var oldTab = currentTabs[oldTabId];
    delete currentTabs[oldTabId];

    queue.delete(String(dataObj.tab.id));
    queue.update(String(oldTab.id), dataObj.data);
    timer.initialize(queue);
  }
});





    // var oldTab = currentTab;
    // currentTab = dataObj.tab;
    
    // if (oldTab && oldTab.id !== currentTab.id) {
    //   queue.delete(String(currentTab.id));
    //   queue.update(String(oldTab.id), dataObj.data);
    //   timer.initialize(queue);
    // }

  });
});

chrome.tabs.onRemoved.addListener(function(tabId){
	queue.delete(String(tabId));
  timer.initialize(queue);
});


},{}],5:[function(require,module,exports){
var getWindow = function(windowId) {
  return new Promise(function(resolve){
  	try {
  		chrome.windows.get(windowId, resolve);
  	} catch(error){
  		reject(error);
  	}
  });
};

var getTabsInWindow = function(windowId){
  return new Promise(function(resolve, reject){
    try{
    	chrome.windows.get(windowId, function(selectedWindow){
    		resolve(selectedWindow.tabs);
    	})
    } catch(error){
    	reject(error);
    }
  });
};


chrome.windows.onCreated.addListener(function(windowObj){
  currentTabs[windowObj.id] = windowObj.tabs;
});

chrome.windows.onRemoved.addListener(function(windowId){
  delete currentTabs[windowId];
});




},{}],6:[function(require,module,exports){

var queue = require('./algorithm/Queue.js');

/* globals $: false */
$(function(){
  /* globals chrome: false, ENV: false */
  console.log('Service Initialized');

  chrome.browserAction.onClicked.addListener(function(){
    getTab(postTabs);
  });

  function getTab(callback){
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabArray){
      var tab = tabArray[0];
      var url = [tab.url];
      
      console.log(url);

      callback(url).then(console.log('success'));
    });
  }

  function postTabs(urls) {
    // sending object
    return new Promise(function(resolve,reject){
      $.ajax({
        type: 'POST',
        url: ENV.url + '/links',
        data: {urls: urls},
        success: resolve
      })
      .fail(reject);
    });
  }
});
},{"./algorithm/Queue.js":2}]},{},[1,2,3,4,5,6]);
