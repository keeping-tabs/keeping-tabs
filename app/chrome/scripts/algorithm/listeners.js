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
      // resolves the tab
    } catch (error) {
      reject(error);
    }
  });

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