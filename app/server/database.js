var path = require('path');
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database(path.join(__dirname, '../db/keeping-tabs.sqlite3'), function(err) {
  if(err) console.error('Database connection error: ', err);
});

db.serialize(function() {
  db.run("DROP TABLE IF EXISTS links");
  db.run("CREATE TABLE IF NOT EXISTS links (title TEXT, url TEXT, created TEXT)");

  // var statement = db.prepare("INSERT INTO links VALUES ($title, $url, $created)");
  // for (var i = 0; i < 10; i++) {
  //     statement.run({
  //       $title: "Ipsum " + i,
  //       $url: 'http://apple.com',
  //       $created: Date.now()
  //     });
  // }
  // statement.finalize();

  // db.each("SELECT * FROM links", function(err, link) {
  //     console.log(link.title + ": " + link.url + "--" + Date(link.created));
  // });
});




db.saveUrls = function (urls) {
  return new Promise(function (resolve, reject) {
    var statement = db.prepare("INSERT INTO links VALUES ($title, $url, $created)");
    urls.forEach(function (url, index) {
      statement.run({
        $title: "Title " + index,
        $url: url,
        $created: Date.now()
      }, function (error) {
        if (error) {
          reject(error);
        }    
        if (index === urls.length - 1) {
          resolve(urls.length + ' URLs are saved');
        }
      });
    });
  });
};





db.fetchUrls = function () {
  return new Promise(function (resolve, reject) {
    var data = [];
    db.each("SELECT * FROM links", function(error, link) {
      if (error) {
        reject(error)
      };
      data.push(link);
      // console.log(link.title + ": " + link.url + "--" + Date(link.created));
    }, function (error) {
      if (error) {
        reject(error)
      };
      resolve(data);
    });
  });
};


// // Example
// db.saveUrls(['a','b','c'])
//   .then(function (success) {console.log(success);})
//   .then(function (){
//     db.fetchUrls()
//       .then(function(data){
//         console.log(data);
//       })
//    .catch(function(error){
//       console.log(error);
//     });
//   })
// .catch(function (error) {console.log(error);});




module.exports = db;



