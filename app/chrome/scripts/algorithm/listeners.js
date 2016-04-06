//assumes instance of Queue exists
var queue = new Queue();
var timer = Object.create(Timer);


var currentTab = null;


var getTabs = function (tabId) {
  return new Promise(function (resolve) {
    chrome.tabs.get(tabId, function(tab){
      // console.log('got tab', tab);
     resolve(tab);
    });
  });
};

var setData = function (tab) {
  var data = {
    url: tab.url,
    createdAt: Date.now()
  };

  return Promise.resolve({data:data, tab: tab});
};




chrome.tabs.onCreated.addListener(function(tab){
	console.log('created: ', tab.id);
  setData(tab)
  .then(function (dataObj) {
  	var oldTab = currentTab;
    currentTab = dataObj.tab;
    if (oldTab !== null) {
      queue.enqueue(String(oldTab.id), dataObj.data);
      timer.initialize(queue);
    } 
  });
});

chrome.tabs.onUpdated.addListener(function(tabId){
  getTabs(tabId)
  .then(setData)
  .then(function (dataObj) {
    console.log('updated the tab: ', dataObj.tab.id);
  });
});

chrome.tabs.onActivated.addListener(function(activeInfo){
	// find tab in queue using tabId (given in activeInfo),
  var tabId = activeInfo.tabId;

  getTabs(tabId)
  .then(setData)
  .then(function (dataObj) {
    console.log('activated', dataObj.tab.id);

    var oldTab = currentTab;
    currentTab = dataObj.tab;
    
    if (oldTab && oldTab.id !== currentTab.id) {
      queue.delete(String(currentTab.id));
      queue.update(String(oldTab.id), dataObj.data);
      timer.initialize(queue);
    }

  });
});

chrome.tabs.onRemoved.addListener(function(tabId){
	queue.delete(String(tabId));
  timer.initialize(queue);
});