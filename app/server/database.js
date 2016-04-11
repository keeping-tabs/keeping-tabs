var path = require('path');
var sqlite3 = require('sqlite3');

var db = new sqlite3.Database(path.join(__dirname, '../db/keeping-tabs.sqlite3'), function(err) {
  if(err) {
    console.error('Database connection error: ', err);
  }
});

db.serialize(function() {
  //Uncomment to drop tables when restarting the server
  db.run('DROP TABLE IF EXISTS links');
  db.run('DROP TABLE IF EXISTS users');
  db.run('DROP TABLE IF EXISTS users_links_join');

  db.run('CREATE TABLE IF NOT EXISTS links (id INTEGER PRIMARY KEY ASC, title TEXT, url TEXT UNIQUE, created INTEGER)');
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY ASC, username TEXT UNIQUE, salt TEXT, password TEXT,created INTEGER)');
  db.run('CREATE TABLE IF NOT EXISTS users_links_join (id INTEGER PRIMARY KEY ASC, userId INTEGER, linkId INTEGER, FOREIGN KEY(userId) REFERENCES users(id), FOREIGN KEY(id) REFERENCES links(id))');
});


db.insertIntoTableStatement = function (table, keyString) {
  return db.prepare('INSERT INTO ' + table + ' VALUES (' + keyString + ')');
};

db.insertInto = function (table, data, includePrimaryKey) {
  // table should be a string 
  // data should be an array of data in the order of table columns
  // example: table = 'users'; data = [userId, linkId];
  if (typeof table !== 'string' || !(Array.isArray(data))) {
    throw new Error('expected argument types string and array instead received ' + typeof table + ' and ' + typeof data);
  }

// console.log('attempt to insert ', table, data, includePrimaryKey);

  return new Promise(function (resolve, reject) {

    var keys = data.map(function (val, index) {return '$' + index;});
    var keyString = ( includePrimaryKey ? '$primary, ' : '') + keys.reduce(function (hold, current) {return hold + ', ' + current;});
    var statement = db.insertIntoTableStatement(table, keyString);
    
    var index = -1;
    var statementData = data.reduce(function (hold, current) {
      index++;
      hold['$' + index] = current;
      return hold;
    }, {});

    statement.run(statementData, function (error) {
      if (error) {
        reject(error);
      }
      resolve('' + data + ' Saved to ' + table + ' table');
    });
  });

};


db.saveUrlUserJoin = function (userId, linkId) {
  // console.log('call of saveUrlUserJoin', userId, linkId)
 return db.insertInto('users_links_join', [userId, linkId], true);
};


db.fetchTable = function (table, columns, where) {

  // table should be a sql string of the table name
  // columns should be a sql string of the column names
  // where should be a sql string of the conditional options
  return new Promise(function (resolve, reject) {

   //add edge case logic for inputs. throw error for bad data
   //use regex

    db.all(
      'SELECT ' + ( columns ? columns : '*' ) + ' FROM ' + table + ' WHERE ' + ( where ? where : '1 = 1') + '', 
      function(error, data) {
        if (error) {
          reject(error);
        }
        resolve(data);
      }
    );
  });
};

db.fetchLinksForUser = function (username) {
  // console.log('fetch links for username: ', username);
  return db.joinTable(
    'users', 
    'users_links_join', 
    ' users.username="' + username + '" and users.id = users_links_join.userId',
    'INNER', 
    'linkId')
  .then(function (data) {
    // console.log('data: ', data);
    return Promise.resolve(
      data.map(function (element) {return element.linkId;})
      .map(function (id) {return 'id = ' + id;})
      .join(' or ')
    );
  })
  .then(function (where) {
    // console.log('where: ', where);
    return db.fetchTable('links', 'title, url', where);
  });
};

db.joinTable = function (table1, table2, conditional, joinType, columns) {

  // table should be a sql string of the table name
  // columns should be a sql string of the column names
  // where should be a sql string of the conditional options
  return new Promise(function (resolve, reject) {
   //add edge case logic for inputs. throw error for bad data
   //use regex
    db.all(
      // SELECT ... FROM table1 [INNER] JOIN table2 ON conditional_expression ...

      'SELECT ' + ( columns ? columns : '*' ) + ' FROM ' + table1 + ' ' + ( joinType ? joinType : '' ) + ' JOIN ' + table2 + ' ON ' + ( conditional ? conditional : '1=1' ), 
      // 'SELECT * FROM users',
      function(error, data) {
        if (error) {
          reject(error);
        }
        resolve(data);
      }
    );
  });
};

var hash = function (password, salt) {
  // hash the password here
  return salt + password;
};


db.saveUsers = function (users) {
  return new Promise(function (resolve) {
    users.forEach(function (user, index) {
      var salt = 'tabsSalt';
     db.insertInto('users', [user.username, salt, hash(user.password, salt), Date.now()], true)
     .then(function () {
      if (index === users.length - 1) {
        resolve('' + users.length + ' users were saved');
      }
     });
    });
  });
};



db.fetchUsers = function () {
  return db.fetchTable('users');
};

db.fetchUserId = function (username) {
  return db.fetchTable('users', 'id', 'username="' + username + '"');
};

db.fetchUser = function (username) {
  console.log('attempt to fetch data for user: ', username);
  return db.fetchTable('users', '*', 'username="' + username + '"');
};


db.saveUrls = function (urls) {
  if (!(Array.isArray(urls))) {
    throw new Error('expected urls argument to be an array. Instead typeof urls === ' + typeof urls);
  } else if (urls.length === 0) {
    return Promise.resolve('' + urls.length + ' urls were saved');
  }


  return new Promise(function (resolve) {
    urls.forEach(function (url, index) {
     db.insertInto('links', ['Title ' + index, url, Date.now()], true)
     .then(function () {
      if (index === urls.length - 1) {
        // console.log('' + (index + 1) + ' urls were saved');
        resolve('' + urls.length + ' urls were saved');
      }
     });
    });
  });
};

db.saveLinks = function (links, username) {
    // console.log('username:', username);
  if (!(Array.isArray(links))) {
    throw new Error('expected links argument to be an array. Instead typeof links === ' + typeof links);
  } else if (links.length === 0) {
    return Promise.resolve('' + links.length + ' users were saved');
  }


  return new Promise(function (resolve) {
    db.fetchUserId(username)
    .then(function (userId) {
      // console.log('userId:', userId);
      links.forEach(function (link, index) {
        db.fetchTable('links', 'id', 'url="' + link.url + '"')
        .then(function (ids) {
          // console.log('ids: ', ids);
          // console.log('link:', link);
          if (ids.length === 0) {
           return db.insertInto('links', [link.title, link.url, Date.now()], true);
          }
          return Promise.resolve();
        })
        .then(function () {
          return db.fetchLinkId(link.url);
        })
        .then(function (linkId) {
          // console.log('linkId:', linkId);
          // console.log('userId:', userId);
          return db.saveUrlUserJoin(userId[0].id, linkId[0].id);
        })
        // .then(log)
       

        .then(function () {
          // console.log('index:', index);
          if (index === links.length - 1) {
            // console.log('' + (index + 1) + ' links were saved');
            resolve('' + links.length + ' links were saved');
          }
        });
      });
    });
  });

};




// this can be cahnged to just return the urls instead of all the data if that is desired
db.fetchUrls = function () {
  return db.fetchTable('links');
};

db.fetchLinkId = function (url) {
  return db.fetchTable('links', 'id', 'url="' + url + '"');
};





// var log = function (data, message) {
//   console.log(data, message ? message : ' : resolved in promise');
//   return Promise.resolve(data);
// };

// // Save Users
// db.saveUsers(['louie', 'jake', 'justin', 'ivan'])
// .then(log)

// // then fetch the users
// .then(db.fetchUsers)
// .then(log)


// // save urls
// .then(function () {
//   return db.saveUrls(['a','b','c']);
// })
// .then(log)

// // then fetch the urls
// .then(function (){
//   return db.fetchUrls()
//   .then(log);
// })

// .then(function () {

//   console.log('attempt to save user-url join');
//   return db.saveUrlUserJoin(1, 1)
//   .then(log)

//   .then(function (){
//     return db.saveUrlUserJoin(1, 3);
//   })
//   .then(log)

//   .then(function (){
//     return db.saveUrlUserJoin(2, 3);
//   })
//   .then(log)

//   .then(function (){
//     return db.saveUrlUserJoin(2, 2);
//   })
//   .then(log)

//   .then(function (){
//     return db.saveUrlUserJoin(3, 1);
//   })
//   .then(log);
// })
// .then(function () {
//   return db.fetchUserId('louie');
// })
// .then(log)


// .then(function () {
//   return db.joinTable('users', 'users_links_join', ' users.username="louie" and users.id = users_links_join.userId', 'INNER', 'linkId');
// })
// .then(log)
// .then(function () {
//   return db.fetchLinksForUser('louie');
// })
// .then(log)

// .then(function () {
//   console.log('using save links');
//   return db.saveLinks([{url:'d', title:'D'}, {url:'e', title:'E'}, {url:'f', title:'F'}], 'louie');
// })
// .then(function () {
//   console.log('fetch');
//   return db.fetchLinksForUser('louie');
// })
// .then(log);









module.exports = db;
