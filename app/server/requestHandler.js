var tempUrls = {};
var setUrls = function (urls) {
  // this should be setting the urls in the database, 
  // but for now we will use the tempUrls array
  
  // for each url in the urls array
  urls.forEach(function (url) {
    //create or overwrite the url property in the tempUrls object
    tempUrls[url] = true;
  });
  console.log(tempUrls);
};


exports.linksPost = function (request, response) {
  var urls = request.body.urls;
  setUrls(urls);

  response.sendStatus(201);
  // response.sendStatus(400);
};