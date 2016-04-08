var path = require('path');
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database(path.join(__dirname, '../db/keeping-tabs.sqlite3'), function(err) {
  if(err) {
    console.error('Database connection error: ', err);
  }
});

db.serialize(function() {
  db.run('DROP TABLE IF EXISTS links');
  db.run('CREATE TABLE IF NOT EXISTS links (title TEXT, url TEXT UNIQUE, created TEXT)');
});




db.saveUrls = function (urls) {
  return new Promise(function (resolve, reject) {
    var statement = db.prepare('INSERT INTO links VALUES ($title, $url, $created)');
    urls.forEach(function (url, index) {
      statement.run({
        $title: 'Title ' + index,
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




// this can be cahnged to just return the urls instead of all the data if that is desired
db.fetchUrls = function () {
  return new Promise(function (resolve, reject) {
    var data = [];
    db.each('SELECT * FROM links', function(error, link) {
      if (error) {
        reject(error);
      }
      data.push(link);
    }, function (error) {
      if (error) {
        reject(error);
      }
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



