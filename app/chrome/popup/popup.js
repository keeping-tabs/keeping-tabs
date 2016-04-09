  
(function () {
  /* globals chrome: false */
  console.log('I am popup');


  var localData = JSON.parse(localStorage.keepingTabs);

  var _settings = {
    time: localData.time ? localData.time : 1000 * 60 * 60, // one hour
    active: localData.active ? localData.active : false,
    username: localData.username ? localData.username : 'not signed in'
  };

  
  var Chrome = require('../scripts/algorithm/ChromeHelpers.js');

  var port = chrome.runtime.connect({name: 'popup_setting'});

  port.postMessage('I am popup');

  var $btnSave = $('.js-btn-save');
  var $btnActivate = $('.js-toggle-activate');
  var $radioTime = $('.js-radio-time input');

  var $btnShowCustom = $('.js-show-custom');
  var $custom = $('.js-custom');
  var $inputTime = $('.js-input-time');

  var $username = $('.js-username');
  var $inputUsername = $('.js-input-username');


  $custom.hide();

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
      Chrome.setLocalStorage({active: _settings.active});
    }

    render();
  });

  $radioTime.on('change', function() {
    var time = Number($(this).val()) * 60 * 1000; // min to millisec
    _settings.time = time;
  });

  $inputTime.on('blur', function() {
    var time = Number($(this).val());
    if(isNaN(time)) {
      console.log('not a number');
      return;
    }
    _settings.time = time;
    render();

  });

  $btnSave.on('click', function() {
    Chrome.setLocalStorage({time: _settings.time});
    port.postMessage({time: _settings.time});
  });

  $btnActivate.on('click', function() {
    port.postMessage({active: !_settings.active});
  });

  $btnShowCustom.on('click', function() {
    $custom.toggle();
  });

  $inputUsername.on('blur', function () {
    var username = $inputUsername.val();
    $username.find('label').text('Hello ' + username);
    Chrome.setLocalStorage({username: username});
  });


  (function initializeSettings () {
    $btnSave.trigger('click');
    // $btnActivate.trigger('click');
    port.postMessage({active: _settings.active});
    $username.find('label').text('Hello ' + _settings.username);
  }) ();

  function render() {

    $inputTime.val(_settings.time);

    $radioTime.each(function() {
      var time = _settings.time / 60 / 1000; // millisec to min

      if(Number($(this).val()) === time) {
        $(this).prop('checked', true);
      }
    });

    if(_settings.active) {
      $btnActivate.text('Deactivate');

      chrome.browserAction.setBadgeText({text: 'on'});
      chrome.browserAction.setBadgeBackgroundColor({color: '#00FFFF'});
    } else {
      $btnActivate.text('Activate');

      chrome.browserAction.setBadgeText({text: 'off'});
      chrome.browserAction.setBadgeBackgroundColor({color: '#FF0000'});
    }
    // Chrome.setLocalStorage('active', !_settings.active);

  }
})();