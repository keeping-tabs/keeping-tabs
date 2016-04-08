
////////////////////////////////////////////////////////////////////////////////
//////////////////////// TEMP  TEMP  TEMP  TEMP  TEMP  TEMP  TEMP  TEMP  TEMP//

// this section is temporary awaiting the database logic

// var tempUrls = {};

// var tempSetUrls = function (urls) {
//   // this should be setting the urls in the database, 
//   // but for now we will use the tempUrls array
  
//   // for each url in the urls array
//   urls.forEach(function (url) {
//     //create or overwrite the url property in the tempUrls object
//     tempUrls[url] = true;
//   });

//   // if the complete method has been set to be a function 
//   if (typeof tempSetUrls.complete === 'function' ) {
//     // then call the complete method
//     tempSetUrls.complete('resolved in the tempSetUrls');
//   }
// };

//////////////////////// TEMP  TEMP  TEMP  TEMP  TEMP  TEMP  TEMP  TEMP  TEMP//
////////////////////////////////////////////////////////////////////////////////

var db = require('./database.js');
var _ = require('underscore');
var urlModule = require('url');


var filterNewUrlsOnly = function (urls) {
  return db.fetchTable('links', 'url', urls.map(function (url) {return 'url = "' + url + '"';}).join(' or '))
    .then(function (data) {
      var existingUrls = data.map(function (element) {return element.url;});
      var difference = _.difference(urls, existingUrls);
      return Promise.resolve(difference);
    });
};

var setUrls = function (urls) {
  return new Promise(function (resolve, reject) {
    filterNewUrlsOnly(urls)
    .then(db.saveUrls)
    .then(resolve)
    .catch(reject);
  });
};

var setLinks = function (links, username) {
  return db.saveLinks(links, username);
  // return new Promise(function (resolve, reject) {
  //   filterNewUrlsOnly(links.map(function (link) {return link.url;}))
  //   .then(function (newUrls) {
  //     console.log('new: ',newUrls);
  //     return new Promise(function (resolve) {
  //       var newLinks = links.filter(function (link) {
  //         return newUrls.some(function (url) {return url === link.url;});
  //       });
  //       var oldLinks = _.difference(links, newLinks);

  //       console.log('old: ', oldLinks);
  //       console.log('username: ', username);
  //       db.fetchUserId(username)
  //       .then(function (userId) {
  //         console.log(userId);
  //         if (oldLinks.length === 0) {resolve(newLinks);}
  //         oldLinks.forEach(function (link) {
  //           db.fetchLinkId(link.url)
  //           .then(function (linkId) {
  //             return db.saveUrlUserJoin(userId[0].id, linkId[0].id);
  //           })
  //           .then(function () {
  //           if (index === links.length - 1) {
  //             // console.log('' + (index + 1) + ' links were saved');
  //             resolve(newLinks);
  //           }
  //          });
  //         });
  //       });
  //     })
  //     .then(function (message) {console.log('new Links: ',message);return Promise.resolve(message);})
  //     .then(resolve);
  //   })


  // })
  // .then(function (links) {
  //   console.log('links: ', links);
  //   db.saveLinks(links, username);}
  // )
  // .then(resolve)
  // .catch(reject);
};


exports.linksPost = function (request, response) {
  var urls = request.body.urls;
  console.log('url: ', urls);
  var username = request.body.username;
  // if (!username) {response.sendStatus(400); return null;}
// console.log('username: ', username);
  // console.log(urlModule.parse(urls[0]).host.split('.')[1]);
 
  // setUrls(urls)
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
  db.fetchUrls()
    .then(function (data) {
      response.send(JSON.stringify(data));
    })
  .catch(function (error) {
    response.sendStatus(404);
    response.send(error);
  });
};


exports.urls = function (req, res) {
  var username = req.query.username;
  console.log('username:', username);
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


