(function () {
  /* globals chrome: false */
  console.log('I am popup');

  var port = chrome.runtime.connect({name: 'popup_setting'});

  port.postMessage('I am popup');

  var $btnSave = $('.js-btn-save');
  var $inputTime = $('.js-input-time');

  port.onMessage.addListener(function(msg) {
    if(msg.time) {
      console.log('set time: ', msg.time);
      $inputTime.val(msg.time);
    }
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
})();