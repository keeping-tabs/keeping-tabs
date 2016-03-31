// console.log(urls);

// this script is used in the jade render to dynamically generate the saved urls on the page
// I would like to refactor this to Angular 

urls.forEach(function (url) {
	console.log(url);
  var $a = $('<a>');
  var $p = $('<p>');
  
  $a.attr('href', url)
  $a.text(url);

  $a.appendTo($p);
  $p.appendTo($('body'));
});