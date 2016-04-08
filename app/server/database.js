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
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY ASC, username TEXT UNIQUE, created INTEGER)');
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
    statementData = data.reduce(function (hold, current) {
      index++;
      hold['$' + index] = current;
      return hold
    }, {});

    statement.run(statementData, function (error) {
      if (error) {
        reject(error);
      }
      resolve('' + data + ' Saved to ' + table + ' table');
    })
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
  // console.log('username: ', username);
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


db.saveUsers = function (users) {
  return new Promise(function (resolve) {
    users.forEach(function (user, index) {
     db.insertInto('users', [user, Date.now()], true)
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



db.saveUrls = function (urls) {
  if (!(Array.isArray(urls))) {
    throw new Error('expected urls argument to be an array. Instead typeof urls === ' + typeof urls);
  } else if (urls.length === 0) {
    return Promise.resolve('' + urls.length + ' users were saved');
  }


  return new Promise(function (resolve) {
    urls.forEach(function (url, index) {
     db.insertInto('links', ['Title ' + index, url, Date.now()], true)
     .then(function () {
      if (index === urls.length - 1) {
        console.log('' + (index + 1) + ' urls were saved');
        resolve('' + urls.length + ' users were saved');
      }
     });
    });
  });
};




// this can be cahnged to just return the urls instead of all the data if that is desired
db.fetchUrls = function () {
  return db.fetchTable('links');
};






var log = function (data, message) {
  console.log(data, message ? message : ' : resolved in promise');
  return Promise.resolve(data);
};

// Save Users
db.saveUsers(['louie', 'jake', 'justin', 'ivan'])
.then(log)

// then fetch the users
.then(db.fetchUsers)
.then(log)


// save urls
.then(function () {
  return db.saveUrls(['a','b','c'])
})
.then(log)

// then fetch the urls
.then(function (){
  return db.fetchUrls()
  .then(log);
})

.then(function () {

  console.log('attempt to save user-url join');
  return db.saveUrlUserJoin(1, 1)
  .then(log)

  .then(function (){
    return db.saveUrlUserJoin(1, 3)
  })
  .then(log)

  .then(function (){
    return db.saveUrlUserJoin(2, 3)
  })
  .then(log)

  .then(function (){
    return db.saveUrlUserJoin(2, 2)
  })
  .then(log)

  .then(function (){
    return db.saveUrlUserJoin(3, 1)
  })
  .then(log);
})
.then(function () {
  return db.fetchTable('users', 'id', 'username="louie"');
})
.then(log)


.then(function () {
  return db.joinTable('users', 'users_links_join', ' users.username="louie" and users.id = users_links_join.userId', 'INNER', 'linkId');
})
.then(log)
.then(function () {
  return db.fetchLinksForUser('louie')
})
.then(log);








module.exports = db;





