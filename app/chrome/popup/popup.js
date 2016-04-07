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
  var $btnActivate = $('.js-toggle-activate');
  var $radioTime = $('.js-radio-time input');

  var $btnShowCustom = $('.js-show-custom');
  var $custom = $('.js-custom');
  var $inputTime = $('.js-input-time');
  
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
    port.postMessage({time: _settings.time});
  });

  $btnActivate.on('click', function() {
    port.postMessage({active: !_settings.active});
  });

  $btnShowCustom.on('click', function() {
    $custom.toggle();
  });

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
  }
})();