
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