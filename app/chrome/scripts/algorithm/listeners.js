//assumes instance of Queue exists
var queue = new Queue();

chrome.tabs.onCreated.addListener(function(tab){
	// send tab to queue
	var createdAt = (new Date()).getTime();
	var data = {
		url: tab.url,
		createdAt: createdAt
	};
	console.log(tab);
	queue.enqueue(tab.id, data);
});

chrome.tabs.onUpdated.addListener(function(tabId){
	// look for relevant changed info in changeInfo (object), create (new Date()).getTime(), and run queue.update() with the updated info
  	chrome.tabs.get(tabId, function(tab){
  		var createdAt = (new Date()).getTime();
  		var data = {
  			url: tab.url,
  			createdAt: createdAt
  		};
  		console.log(tab);
  		queue.update(tabId, data);
  	});
	//if queue.first was pointing to updated tab, run initializeTimer()

});

chrome.tabs.onActivated.addListener(function(activeInfo){
	// find tab in queue using tabId (given in activeInfo),
  var tabId = activeInfo.tabId;
  chrome.tabs.get(tabId, function(tab){
    var createdAt = (new Date()).getTime();
    var data = {
    	url: tab.url,
    	createdAt: createdAt
    };
    console.log('hello from here', tab);
    queue.update(tabId, data);
  });
});

chrome.tabs.onRemoved.addListener(function(tabId){
	//remove tabId from our queue
	queue.delete(tabId);
});