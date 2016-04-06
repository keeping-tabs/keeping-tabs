(function () {
  console.log('I am popup');
  $('.js-input-time').on('blur', function() {
    console.log($(this).val());
  });
})();