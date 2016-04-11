
var db = require('./database.js');
var _ = require('underscore');
var urlModule = require('url');



var setLinks = function (links, username) {
// console.log('save links from: ', username);
  return db.saveLinks(links, username);
};


exports.linksPost = function (request, response) {
  var urls = request.body.urls;
  // console.log('url: ', urls);
  var username = request.body.username;
 
// console.log('post received from: ', username);

  setLinks(urls.map(function (url) {return {url: url, title: urlModule.parse(url).host.split('.')[1]};}), username)
    .then(function () {
      response.sendStatus(201);
    })
    .catch(function (error) {
      response.sendStatus(400);
    });
};


// currently the .linksGet will respond with the tempUrls object
// while the .urls will respond with a rendered page utilizing the tempUrls
// there is no need for this redundncy in production
// it is here because we need to decide on the best way to render the links page
// what we have now is just an example

exports.linksGet = function (request, response) {
  var username = request.query.username;

  // console.log(username);


  db.fetchLinksForUser(username)
    .then(function (data) {

      // console.log('---links for ' + username + ' : ' , data);
      response.send(JSON.stringify(data));
    })
  .catch(function (error) {
    response.sendStatus(404);
    response.send(error);
  });
};


exports.urls = function (req, res) {
  var username = req.query.username;
  // console.log('username:', username);
  // db.fetchUrls()
  db.fetchLinksForUser(username)
    .then(function (data) {
      var urls = convertUrlDataToUrlArray(data);
      res.render('links', { title: 'Hey', message: 'Hello there!', 
        
        script: 
          // generate javascript as a string to render with jade
          // ultimately this may be changed to work with Angular
          // also currently relies on the global urls variable
          'var urls =[' +
          //
          urls.map(function (url) { 
              // wrap each url string in single quotes so they are interpreted as strings on the client side
              return '\'' + url + '\'';
            })
            .toString() +

          '];'
      });
    })
  .catch(function (error) {
    res.sendStatus(404);
    res.send(error);
  });
};



function convertUrlDataToUrlArray(data) {
  return data.map(function (link) {
    return link.url;
  });
}


