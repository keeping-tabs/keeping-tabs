(function () {
  /* globals chrome: false */
  console.log('I am popup');

  var port = chrome.runtime.connect({name: 'popup_setting'});

  port.postMessage('I am popup');

  $('.js-input-time').on('blur', function() {
    console.log($(this).val());
  });
})();