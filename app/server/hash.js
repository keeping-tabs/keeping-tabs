var bcrypt = require('bcrypt');
const saltRounds = 10;



var makeHash = function (password) {
  return new Promise(function (resolve) {
    bcrypt.genSalt(saltRounds, function(error, salt) {
        if (error) {
          throw new Error('issue generating the salt: ', error);
        }
        bcrypt.hash(password, salt, function(error, hash) {
          if (error) {
            throw new Error('issue generating the hash');
          } else {
            resolve(hash);
          }
        });
    });
  });
};


var checkHash = function (password, hash) {
  return new Promise(function (resolve) {
    bcrypt.compare(password, hash, function(error, bool) {
      if (error) {
        throw new Error('some issue comparing the password: ', error);
      }
      resolve(bool);
    });
  });

};



module.exports = {makeHash: makeHash, checkHash: checkHash};