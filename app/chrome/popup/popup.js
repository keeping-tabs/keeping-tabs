  
(function () {
  /* globals chrome: false */
  // console.log('I am popup');


  // var localData = JSON.parse(localStorage.keepingTabs);

  var _settings = {
    time: 0,
    active: false,
    username: false
  };

  
  // var Chrome = require('../scripts/algorithm/ChromeHelpers.js');

  var port = chrome.runtime.connect({name: 'popup_setting'});

  // port.postMessage('I am popup');

  var $btnSave = $('.js-btn-save');
  var $btnActivate = $('.js-toggle-activate');
  var $radioTime = $('.js-radio-time input');

  var $btnShowCustom = $('.js-show-custom');
  var $custom = $('.js-custom');
  var $inputTime = $('.js-input-time');

  var $username = $('.js-username');
  var $inputUsername = $('.js-input-username');

  var $links = $('.js-links');

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
    }
    if(msg.username !== undefined) {
      console.log('set username: ', msg.username);
      _settings.username = msg.username;
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
    // Chrome.setLocalStorage({time: _settings.time});
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

    console.log('username blur: ' + username);

    port.postMessage({username: username});

    // $username.find('label').text(_settings.username ? 'Hello ' + _settings.username : '');
    // $links.find('a').attr('href', _settings.username ? 'localhost:8080/urls?username=' + _settings.username : ''/*route to signup*/)
    // Chrome.setLocalStorage({username: _settings.username});
  });


  // (function initializeSettings () {
  //   $btnSave.trigger('click');
  //   // $btnActivate.trigger('click');
  //   port.postMessage({active: _settings.active});
  //   $username.find('label').text('Hello ' + _settings.username);
  // }) ();

  function render() {
    if (_settings.username === false) {
      $('.js-signed-in-container').css('display', 'none');
      $('.js-sign-in-container').css('display', 'block');
    } else {
      $('.js-signed-in-container').css('display', 'block');
      $('.js-sign-in-container').css('display', 'none');
    }


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
    
    $username.find('label').text(_settings.username ? 'Hello ' + _settings.username : '');
    // $links.find('a').attr('href', _settings.username ? 'localhost:8080/urls?username=' + _settings.username : ''/*route to signup*/)
  }
})();