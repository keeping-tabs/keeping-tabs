
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
<<<<<<< 742de868dde72890158b0302d1e2ca3c0a91b658

=======
>>>>>>> working on database server specs dummy user data

var filterNewLinksOnly = function (urls) {
  return db.fetchTable('links', 'url', urls.map(function (url) {return 'url = "' + url + '"';}).join(' or '))
    .then(function (data) {
      var existingUrls = data.map(function (element) {return element.url;});
      var difference = _.difference(urls, existingUrls);
      return Promise.resolve(difference);
    });
};

var setUrls = function (urls) {
  return new Promise(function (resolve, reject) {
<<<<<<< 742de868dde72890158b0302d1e2ca3c0a91b658
    filterNewLinksOnly(urls)
=======
    // tempSetUrls.complete = resolve;//this is to represent the async on done or colplete or end...
    // tempSetUrls(urls);// this is to represent the function call to the setUrlsInTheDatabase async function call
    db.fetchTable('links', 'url', urls.map(function (url) {return 'url = "' + url + '"';}).join(' or '))
    .then(function (data) {
      var existingUrls = data.map(function (element) {return element.url;});
      console.log('existingUrls: ', existingUrls);
      // return Promise.resolve(
        var difference = _.difference(urls, existingUrls);
        console.log('difference: ', difference);
        //);
      return Promise.resolve(difference);
    })
>>>>>>> working on database server specs dummy user data
    .then(db.saveUrls)
    .then(resolve)
    .catch(reject);
  });
};


exports.linksPost = function (request, response) {
  console.log('url: ', request.body.urls);
  setUrls(request.body.urls)
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
  db.fetchUrls()
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










