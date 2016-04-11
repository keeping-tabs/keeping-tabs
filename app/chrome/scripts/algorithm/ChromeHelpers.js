
/* globals $: false, chrome: false, ENV: false */

//////////  //////////  //////////  //////////  //////////  
// helper functions

var Chrome = (function () {
  return Object.create({
    setLocalStorage : function (object) {
      // object should be key value pairs to add to local storage. 
      var storage = JSON.parse(localStorage.keepingTabs);
      for (var key in object) {
        storage[key] = object[key];
      }
      localStorage.keepingTabs = JSON.stringify(storage);
    },
    postTabs : function (urls, username) {
      // sending object
      return new Promise(function(resolve,reject){
        // console.log('post to for user: ', username);
        $.ajax({
          type: 'POST',
          url: ENV.url + '/api/links',
          data: {
            urls: urls,
            username: username
          },
          success: resolve
        })
        .fail(reject);
      });
    },
    getTab : function (tabId) {
      return new Promise(function (resolve, reject) {
          chrome.tabs.get(tabId, resolve);
      });
    },
    getAllTabs : function () {
      return new Promise(function (resolve, reject) {
          chrome.tabs.query({}, resolve);
      });
    },
    getActiveTabs : function () {
      return new Promise(function (resolve, reject) {
          chrome.tabs.query({'active':true}, resolve);
      });
    },
    tabHasLoaded: function (tab) {
      return new Promise(function (resolve) {
        var listener = function (tabId , info) {
          if (info.status === "complete") {
              // I am not sure why the chrome api throws an error with this. I want to remove the listener after it has fired. I realize that the Promise will only be resolved once, but it seems clunky.
              // chrome.onUpdated.removeListener(listener);
              resolve(tab);
          }
        };
        chrome.tabs.onUpdated.addListener(listener);
      });
    },
    isTabActive: function (tab) {
      return Chrome.getActiveTabs()
      .then(function (activeTabs) {
        // is the created tab active
        var bool = activeTabs.some(function (activeTab) {
          return activeTab.id === tab.id;
        });
        return Promise.resolve(bool);
      });
    },
    isTabStillOpen : function (tabId) {
      return Chrome.getAllTabs()
      .then(function (allTabs) {
        var bool = allTabs.some(function (openTab) {
          return openTab.id === tabId;
        });
        return Promise.resolve(bool);
      });
    },
    data : function (tab) {
      return {
        url: tab.url,
        createdAt: Date.now()
      };
    },
    appendToQueue: function (oldTabId, queue, timer) {
      if (!oldTabId) {
        return Promise.reject('oldTabId is undefined');
      }
      return Chrome.isTabStillOpen(oldTabId)
      .then(function (bool) {
        if (bool) {
          return Chrome.getTab(oldTabId)
          .then(function (oldTab) {
            console.log('old tab here: ',oldTab);
            queue.enqueue(String(oldTab.id), Chrome.data(oldTab));
            timer.initialize(queue);
            return Promise.resolve('queued tab ' + oldTab.id);
          });
        }
        return Promise.reject('the oldTab has closed so it cannot be enqueued');
      });
    },/*,

    mapToTabIds : function (tabs) {
      var tabIds = [];
      try {
        tabIds = tabs.map(function (tab) {return tab.id;});
      } catch (error) {
        return Promise.reject(error);
      }
      // console.log(tabs, tabIds);
      return Promise.resolve(tabIds);
      // return Promise.resolve(100);
    },

    containsId : function (tabIds, id) {
      var bool = 'false';
      try{
        bool = tabIds.some(function (tabId) {return tabId === id;});
      } catch (error) {
        return Promise.reject(error);
      }
      return Promise.resolve(bool);
    }*/
  });
})();

module.exports = Chrome;






//////////  //////////  //////////  //////////  ////////// 