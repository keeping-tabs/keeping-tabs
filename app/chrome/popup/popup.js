(function () {
  /* globals chrome: false */
  console.log('I am popup');

  var _settings = {
    time: 0,
    active: false
  };

  var port = chrome.runtime.connect({name: 'popup_setting'});

  port.postMessage('I am popup');

  var $btnSave = $('.js-btn-save');
  var $inputTime = $('.js-input-time');
  var $btnActivate = $('.js-toggle-activate');
  
  // listen to background
  port.onMessage.addListener(function(msg) {
    console.log('msg from background: ', msg);
    if(msg.time !== undefined) {
      console.log('set time: ', msg.time);
      _settings.time = msg.time;
    }
    if(msg.active !== undefined) {
      console.log('set active: ', msg.active);
      _settings.active = msg.active;
    }

    render();
  });

  $btnSave.on('click', function() {
    var time = Number($inputTime.val());
    console.log(time);
    if(isNaN(time)) {
      console.log('not a number');
      return;
    }
    port.postMessage({time: $inputTime.val()});
  });

  $btnActivate.on('click', function() {
    port.postMessage({active: !_settings.active});
  });

  function render() {

    $inputTime.val(_settings.time);

    if(_settings.active) {
      $btnActivate.text('Deactivate');

      chrome.browserAction.setBadgeText({text: 'on'});
      chrome.browserAction.setBadgeBackgroundColor({color: '#00FFFF'});
    } else {
      $btnActivate.text('Activate');
      
      chrome.browserAction.setBadgeText({text: 'off'});
      chrome.browserAction.setBadgeBackgroundColor({color: '#FF0000'});
    }
  }
})();