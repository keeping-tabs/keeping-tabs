//begin
onload = setTimeout(init,0); // workaround for server

function init(){

  openedTabs = document.getElemenybyId('openedTabs');
  var returnedTabs=[];
  getTab(postTabs);
}

function getTab(callback){
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabArray){
    var tab = tabArray[0];
    var url = tab.url
    console.log(url);
    callback(url);
  })
}

function postTabs(url) {
  // sending object 
  req = new XMLHttprequest();
} 