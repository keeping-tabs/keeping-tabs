var path = require('path');
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database(path.join(__dirname, '../db/keeping-tabs.sqlite3'), function(err) {
  if(err) console.error('Database connection error: ', err);
});

db.serialize(function() {
  db.run("DROP TABLE IF EXISTS links");
  db.run("CREATE TABLE IF NOT EXISTS links (title TEXT, url TEXT, created TEXT)");

  // var stmt = db.prepare("INSERT INTO links VALUES ($title, $url, $created)");
  // for (var i = 0; i < 10; i++) {
  //     stmt.run({
  //       $title: "Ipsum " + i,
  //       $url: 'http://apple.com',
  //       $created: Date.now()
  //     });
  // }
  // stmt.finalize();

  // db.each("SELECT * FROM links", function(err, link) {
  //     console.log(link.title + ": " + link.url + "--" + Date(link.created));
  // });
});

module.exports = db;