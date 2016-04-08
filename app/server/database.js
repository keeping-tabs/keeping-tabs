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


db.saveUrlUserJoin = function (userId, linkId) {
  return new Promise (function (resolve, reject) {
    // var statement = db.prepare('INSERT INTO users_links_join VALUES ($id)');
    var statement = db.prepare('INSERT INTO users_links_join VALUES ($id, $userId, $linkId)');
    statement.run(
      // {},
      {$userId: userId, $linkId: linkId},
      function (error) {
        if (error) {
          reject(error);
        }
        resolve('saved users_links_join: ' + userId + ' : ' + linkId);
      }
    );
  });
};



db.fetchUsersforLink = function (linkId) {
  return new Promise(function (resolve, reject) {
    var data = [];
    db.each('SELECT * FROM users_links_join', function(error, join) {
      if (error) {
        reject(error);
      }
      data.push(join);
    }, function (error) {
      if (error) {
        reject(error);
      }
      resolve(data);
    });
  });
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

db.fetchLinksForUser = function (username) {
  console.log('username: ', username);
  return db.joinTable(
    'users', 
    'users_links_join', 
    ' users.username="' + username + '" and users.id = users_links_join.userId',
    'INNER', 
    'linkId')
  .then(function (data) {
    console.log('data: ', data);
    return Promise.resolve(
      data.map(function (element) {return element.linkId;})
      .map(function (id) {return 'id = ' + id;})
      .join(' or ')
    );
  })
  .then(function (where) {
    console.log('where: ', where);
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


db.fetchUserId = function (username) {
  return db.fetchTable('users', 'id', 'username="' + username + '"')
  .then(function (data) {
    if (data.length !== 1) {
      return Promise.reject('username not found');
    } else if (typeof data[0].id !== 'number') {
      return Promise.reject('username not found');
    }
    return Promise.resolve(data[0].id);
  });
};

db.fetchLinkById = function (linkId) {
  return db.fetchTable('links', 'title, url', 'id="' + linkId + '"')
  .then(function (data) {
    if (data.length === 0) {
      return Promise.reject('no link #' + linkId + ' was found');
    }
    return Promise.resolve(data);
  });
};

db.fetchLinkIdsForUserId = function (userId) {
  return db.fetchTable('users_links_join', 'linkId', 'userId="' + userId + '"')
  .then(function (data) {
    if (data.length === 0) {
      return Promise.reject('no links for userId #' + userId + ' was found');
    }
    return Promise.resolve(data.map(function (element) {return element.linkId;}));
  });
};

db.fetchAllLinksForUser = function (username) {
  return db.fetchUserId(username)
  .then(db.fetchLinkIdsForUserId)
  .then(function (linkIds) {
    return new Promise(function (resolve) {
      var links = [];
      linkIds.forEach(function (linkId, index) {
        db.fetchLinkById(linkId)
        .then(function (data) {
          links.push(data);
          if (index === linkIds.length - 1) {
            resolve(links);
          }
        });
      });
    });
  });
};

db.saveUsers = function (users) {
  return new Promise(function (resolve, reject) {
    var statement = db.prepare('INSERT INTO users VALUES ($id, $username, $created)');
    users.forEach(function (username, index) {
      statement.run({
        $username: username,
        $created: Date.now()
      }, function (error) {
        if (error) {
          reject(error);
        }
        if (index === users.length - 1) {
          resolve(users.length + ' Users are saved');
        }
      });
    });
  });
};



db.fetchUsers = function () {
  return new Promise(function (resolve, reject) {
    var data = [];
    db.each('SELECT * FROM users', function(error, user) {
      if (error) {
        reject(error);
      }
      data.push(user);
    }, function (error) {
      if (error) {
        reject(error);
      }
      resolve(data);
    });
  });
};



db.saveUrls = function (urls) {
  if (!Array.isArray(urls)) {
    throw new Error('expected urls argument to be an array. Instead typeof urls === ' + typeof urls);
  } else if (urls.length === 0) {
    return Promise.resolve();
  }
  return new Promise(function (resolve, reject) {
    var statement = db.prepare('INSERT INTO links VALUES ($id, $title, $url, $created)');
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






/*
db.saveUsers(['louie', 'jake', 'justin', 'ivan'])
.then(function (log) {console.log(log);return Promise.resolve()})
.then(db.fetchUsers)
.then(function (log) {console.log(log);return Promise.resolve()})

.then(function () {
  db.saveUrls(['a','b','c'])
})
  .then(function (success) {console.log(success);})
  .then(function (){
    db.fetchUrls()
      .then(function(data){
        console.log(data);
      })
   .catch(function(error){
      console.log(error);
    });
  })
.catch(function (error) {console.log(error);})
.then(function () {
  return db.saveUrlUserJoin(1, 1)
  .then(function (message){
    console.log(message);
    return db.saveUrlUserJoin(1, 3)
  })
  .then(function (message){
    console.log(message);
    return db.saveUrlUserJoin(2, 3)
  })
  .then(function (message){
    console.log(message);
    return db.saveUrlUserJoin(2, 2)
  })
  .then(function (message){
    console.log(message);
    return db.saveUrlUserJoin(3, 1)
  })
  .then(function (message) {
    console.log(message);
    return db.fetchUsersforLink();
  })
  .then(function (message) {
    console.log('join data: ', message);
    return Promise.resolve();
  });
})
.then(function () {
  return db.fetchTable('users', 'id', 'username="louie"');
})
.then(function(message){
  console.log(message);
  return Promise.resolve();
})
.then(function () {
  return db.fetchUserId('jake');
})
.then(function(message){
  console.log(message);
  return Promise.resolve();
})
.then(function () {
  return db.fetchLinkById(2);
})
.then(function(message){
  console.log(message);
  return Promise.resolve();
})
.then(function () {
  return db.fetchLinkIdsForUserId(1);
})
.then(function(message){
  console.log(message);
  return Promise.resolve();
})
.then(function () {
  return db.fetchAllLinksForUser('louie');
})
.then(function(message){
  console.log('all links: ', message);
  return Promise.resolve();
})
.then(function () {
  return db.joinTable('users', 'users_links_join', ' users.username="louie" and users.id = users_links_join.userId', 'INNER', 'linkId');
})
.then(function(message){
  console.log('join: ', message);
  return Promise.resolve();
})
.then(function () {
  return db.fetchLinksForUser('louie')
})
.then(function(message){
  console.log('links: ', message);
  return Promise.resolve();
});


*/





module.exports = db;





